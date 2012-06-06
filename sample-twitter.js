// ** 1. Initialize variables and modules **
require('./credentials.js');
var express = require('express'),
    https = require('https'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    port = process.env.PORT || 8081,
    streamRoom = 'twitter',
    uri = "/1/statuses/filter.json?locations=-74,40,-72,42"; // New York
    
// Tell the Express framework where to find our static files and redirect / to index.html
app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res) {
    res.redirect("/index.html");    
});


// ** 2. set up the streaming connection to google **
var options = {
    host: "stream.twitter.com",
    path: uri,
    auth: credentials.user + ":" + credentials.password
};
var request = https.request(options, function(response) {
    response.on("data", function(chunk) {
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

// 3. ** handle WebSocket connections **
io.sockets.on('connection', function (socket) {
    console.log("New client added");
    socket.join(streamRoom);
});

// ** 4. start the application **
app.listen(port);
console.log("Server started in port: " + port);