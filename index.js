const express = require('express')
const path = require('path')
const http = require('http')
const url = require('url')
const $ = require('jquery')
const bodyParser = require('body-parser');

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


/* bodyParser setup */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', PORT);

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))



/* Retrieve the home page, which prompts the user to login to Spotify */
app.get('/', function(request, response) {

    response.render('pages/login.ejs');
});


/* Render the home page */
app.get('/home', function(request, response) {
    response.render('pages/home.ejs');
});


/* Fetch any nearby queues */
app.get('/nearby', function(request, response) {
    var res_html = "";

    /* Retrieve all database information */
    db.collection('queues', function (err, collection) {

        /* Return the results as an array */
        if (!err) {
            collection.find().toArray(function(err, results) {

                if (!err) {
                    /* If no queues are found, return a link to start a new one */
                    if (results.length == 0) {

                        /* Update this response with a POST form that generates a new collection */
                        res_html = '<h3>No queues found. Start one below!</h3>';

                    }
                    else {
                        for (var i = 0; i < results.length; i++) {
                            res_html += '<li class="list-group-item list-group-item-action list-group-item-info">' + results[i].queue_name + '</li>';
                        }
                    }
                    response.send(res_html);
                }
                else {

                    return console.log("Error: " + err + "\nThe search failed");
                }
            });
        }
        else {
            return console.log("Error: " + err + "\nThe collection could not be found")
        }
    });
});


/* POST request to add a new queue to the database */
app.post('/home', function(request, response) {
    
    db.collection('queues', function (err, collection) {
        if (!err) {
            /* Create the entry */
            var entry = {
                queue_name: request.body.queue_string
            };

            /* Insert the new entry */
            collection.insert(entry, function(error, saved) {
                if (error) {
                    console.log("Error: " + error);
                    response.sendStatus(500);
                }
                else {
                    response.sendStatus(200);
                }
            });
        }
        else {
            console.log("Error: " + err + "\nThe collection could not be found");
            response.send(500);
        }
    });


});





