var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongojs = require("mongojs");

var app = express();

var PORT = process.env.PORT || 2408

// Setting Handlebars

var exphbs = require('express-handlebars')


app.engine('handlebars', exphbs({ defaultLayout: 'main'}))

app.set('view engine', 'handlebars')

var databaseUrl = "NewsScraper";
var collections = ["NewsScraperData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// ________________________MY SCRAP REQUEST____________________________________________

request("https://www.nytimes.com/", function(error, response, html){

var $ = cheerio.load(html);

var results = [];


$(".theme-summary").each(function(i, element){
    

    var title = $(element).find("h2.story-heading").text();

    var link = $(element).find("h2").find("a").attr("href")
    
    
    var summary = $(element).parent().find("p.summary").text()
    

        console.log("title" ,title);

        console.log("link", link);

        console.log("summary", summary);

    

    
    if(title && link && summary){

        db.NewsScraperData.insert({
            title: title,
            link: link,
            summary : summary
        })
    }
})


})

console.log({});
// ___________________________________END MY SCRAPE _____________


// ______________________START ROUTES___________________

app.get("/", function(req, res){




db.NewsScraperData.find({}, function(error, found){
    res.render("index", {found : found})
})

})














app.listen(PORT , function(){
    console.log("App running on Port " + PORT);
})