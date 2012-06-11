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

// start the application **
app.listen(port);
console.log("Server started in port: " + port);