// Initialize variables and modules **
require('./credentials.js');
var express = require('express'),
    https = require('https'),
    app = express.createServer(),
    port = process.env.PORT || 8081;
    
// Tell the Express framework where to find our static files and redirect / to index.html
app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res) {
    res.redirect("/index.html");    
});

var options = {
    host: 'stream.twitter.com',
    path: '/1/statuses/filter.json?locations=-74,40,-72,42',
    auth: credentials.user + ":" + credentials.password
}
var request = https.request(options, function(response) {
    response.on("data", function(chunk) {
        if(chunk.toString().trim() != "") {
            var tweet = JSON.parse(chunk);
            if(tweet.geo) {
                console.log("Tweet: lat = " + tweet.geo.coordinates[1] + ", long = " + tweet.geo.coordinates[1]);
            }
        }
    });
});
request.end();

// start the application **
app.listen(port);
console.log("Server started in port: " + port);