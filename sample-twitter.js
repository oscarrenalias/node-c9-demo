var express = require('express'),
    https = require('https'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    port = process.env.PORT || 8081,
    streamRoom = 'twitter',
    filterLocationURI = "/1/statuses/filter.json",
    defaultLocation = "?locations=-74,40,-72,42";  // New York
    
// user and password of our test user - kids don't try this at home
var USERNAME = "acnstreamtest";
var PASSWORD = "testtest8899";

var options = {
    host: "stream.twitter.com",
    port: 443,
    path: filterLocationURI + defaultLocation,
    method: "GET",
    auth: USERNAME + ":" + PASSWORD
};
var request = https.request(options, function(response) {
    response.on("data", function(chunk) {
        console.log("chunk=\"" + chunk + "\""); 
        if(chunk.toString().trim() != "") {
            var tweet = JSON.parse(chunk);
            if(tweet.geo) {
                console.log(tweet.geo.coordinates);    
                io.sockets.in(streamRoom).emit('tweet', 
                    {lat:tweet.geo.coordinates[0], lng:tweet.geo.coordinates[1], text:tweet.text});
            }
        }
    });
});
request.end();

// set up the route for the root URL
app.get("/", function(req, res) {
    res.redirect("/index.html");    
});

// tell Express where to find static files
app.use(express.static(__dirname + "/public"));

// event for socket.io
io.sockets.on('connection', function (socket) {
    console.log("New client added");
    socket.join(streamRoom);
});

// start the application
app.listen(port);
console.log("Server started in port: " + port);