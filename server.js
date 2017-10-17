var express = require('express')
var mongoose = require('mongoose')


var app = express();

var PORT = process.env.PORT || 2408


var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));


var exphbs = require('express-handlebars')


app.engine('handlebars', exphbs({ defaultLayout: 'main'}))

app.set('view engine', 'handlebars')

var request = require('request')
var cheerio = require('cheerio')

request("https://www.nytimes.com/", function(error, response, html){

var $ = cheerio.load(html);

var results = [];


$("h2.story-heading").each(function(i, element){
    

    var title = $(element).text();

    var link = $(element).children().attr("href")


    results.push({
        title: title,
        link: link
    })
})


console.log(results);
})

app.listen(PORT , function(){
    console.log("App running on Port " + PORT);
})