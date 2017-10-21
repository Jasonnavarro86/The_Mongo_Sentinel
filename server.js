var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();

var PORT = process.env.PORT || 2408

// Middleware 

app.set(bodyParser.json())
app.set(bodyParser.urlencoded({
    extended: false
}))

// Setting Handlebars

var exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars')


// Mongo DB and Collection 
var db = require("./models")

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/mongoSentinel", {
    useMongoClient: true
})



// ________________________MY SCRAP REQUEST____________________________________________

app.get("/scrape", function (req, res) {



    request("https://www.nytimes.com/", function (error, response, html) {

        var $ = cheerio.load(html);

        var results = {};


        $(".theme-summary").each(function (i, element) {


            results.title = $(element).find("h2.story-heading").text()

            results.link = $(element).find("h2").find("a").attr("href")

            results.summary = $(element).parent().find("p.summary").text()


            if (results.title && results.link && results.summary) {

                db.Article.create(results)

            }
        })


    })
})

// ___________________________________END MY SCRAPE _____________


// ______________________START ROUTES___________________

app.get("/", function (req, res) {


    db.Article.find({}, function (error, found) {
        res.render("index", {
            found: found
        })
    })

}) // End of "/"___________


app.post("/save/:id", function (req, res) {

    var id = req.params.id;

    var resObj = {}
    db.Article.findOne({
            _id: id
        })
        .then(function (foundOne) {

            resObj.title = foundOne.title;
            resObj.link = foundOne.link;
            resObj.summary = foundOne.summary;

            db.SavedArticle.create(resObj)

            db.Article.findOneAndRemove({
                _id: id
            }, function (err, homeDelete) {
                if (err) {
                    console.log(err);
                }
                res.redirect("/")
            })
        })


}) // End of "/save/:id"___________

app.get("/saved", function (req, res) {
    db.Note.find({}, function(err, noteFound){
        
   
    db.SavedArticle.find({})
    .populate("Note")
    .exec(function(err, data){

       console.log(noteFound);
         
        res.render("saved", {
                saved: data,
                theNote: noteFound

            })
        })

    })
}) // End of "/saved"___________


app.get("/delete/:id", function (req, res) {

    var id2 = req.params.id;

    db.SavedArticle.findOneAndRemove({
        _id: id2
    }, function (err, foundDelete) {

        if (err) {
            console.log(err);
        }
        res.redirect("/saved")
    })

}) // End of "/delete/:id"___________


app.get("/addnote/:note", function(req, res){

   
var array = req.params.note.split(",");


var getNote = {
    
   body: array[0]

}
console.log(array[1]);
    db.Note.create(getNote, function(err, made){
            if (err){
               throw err;
            }


        db.SavedArticle.findOneAndUpdate({ _id : array[1]}, { $push: { "note": made._id }} , { new: true }, function(error, update){
            if (err){
                throw err;
            }

            res.send(update)
        })

        

    })

    
})














app.listen(PORT, function () {
    console.log("App running on Port " + PORT);
})