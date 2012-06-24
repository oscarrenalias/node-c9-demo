NodeJs Demo
===========
This is a very simple application that connects to Twitter's filtered stream and listents to Tweets within 
New York's bounding box. When a tweet arrives, it will push it to all WebSocket clients (using socket.io). 
The application is a good example of what can be achieved with just a handful of Javascript code, Express, Socket.io
and the Twitter and Google Maps APIs.

Additionally, @Sirlle contributed a CoffeeScript version (same code and functionality but implemented with Javascript).