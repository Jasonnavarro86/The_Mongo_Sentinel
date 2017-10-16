var express = require('express')

var bodyParser = require('body-parser')

var cheerio = require('cheerio')

var app = express();

var PORT = process.env.PORT || 2408


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));


var exphbs = require('express-handlebars')


app.engine('handlebars', exphbs({ defaultLayout: 'main'}))

app.set('view engine', 'handlebars')



app.listen(PORT , function(){
    console.log("App running on Port " + PORT);
})