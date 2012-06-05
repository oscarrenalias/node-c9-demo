var express = require('express'),
    http = require('https'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    port = process.env.PORT,
    filterLocationURI = "/1/statuses/sample.json",
    defaultLocation = "?locations=-74,40,-73,41";  // New York
    
// user and password of our test user - kids don't try this at home
var USERNAME = "acnstreamtest";
var PASSWORD = "..fill me in...";

// connect to the Twitter streaming API
var headers = [];
var auth = new Buffer(USERNAME + ':' + PASSWORD).toString('base64');
headers['Authorization'] = "Basic " + auth;
headers['Host'] = "stream.twitter.com";
var options = {
    host: "stream.twitter.com",
    port: 443,
    path: filterLocationURI + defaultLocation,
    method: "GET",
    auth: USERNAME + ":" + PASSWORD /*,
    headers: headers*/
};

var request = http.request(options, function(response) {
    response.on("data", function(chunk) {
        console.log("chunk=" + chunk);    
    });
});
request.on("error", function(error) {
    console.log("Something went wrong: " + error);    
});

// set up the route for the root URL
app.get("/", function(req, res) {
    res.redirect("/index.html");    
});

// tell Express where to find static files
app.use(express.static(__dirname + "/public"));

// event for socket.io
io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

// start the application
app.listen(port);
console.log("Server started in port: " + port);