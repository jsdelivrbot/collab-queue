const express = require('express')
const path = require('path')
const http = require('http')
const url = require('url')
const $ = require('jquery')

const PORT = process.env.PORT || 5000


var app = express();

/* Mongo setup stuff */
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/queue_server";

const MongoClient = require('mongodb').MongoClient;
const format = require('util').format;

var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
    if (error) {
        return console.log(error);
    }
    db = databaseConnection;
});

app.set('port', PORT);

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))




app.get('/', function(request, response) {

    response.render('pages/login.ejs');
});

app.get('/home', function(request, response) {
    response.render('pages/home.ejs');
});







