cf = require 'cloudfoundry'
https = require 'https'
require './credentials.js'

require('zappajs') Number( cf.port || process.env.PORT ), ->
    # CloudFoundry doesn't yet support sockets, so we have to use xhr-polling
    @io.set 'transports', ['xhr-polling']
    @enable 'serve jquery', 'serve sammy'

    # Forward to index
    @get '/': -> @render 'index': {layout: no}

    # Twitter stream options
    options = 
        host: "stream.twitter.com"
        path: "/1/statuses/filter.json?locations=-74,40,-72,42" # New York
        auth: credentials.user + ":" + credentials.password

    # If the stream breaks, reset it
    do stream = =>
        req = https.get options, (res) =>
            res.on 'data', (chunk) =>
                tweet = JSON.parse chunk
                if tweet.coordinates
                    @io.sockets.emit 'tweet', {lat:tweet.coordinates.coordinates[1], lng:tweet.coordinates.coordinates[0], text:tweet.text, user:tweet.user.screen_name}
        req.on 'error', ->
            console.log 'Error while getting the twitter hose, resetting'
            do stream
            
    # Client side javascript for the view
    @client '/index.js': ->
        @on tweet: ->
            new google.maps.Marker
                position: new google.maps.LatLng @data.lat, @data.lng
                map: map
                animation: google.maps.Animation.DROP
                title: @data.user + ':' + @data.text

        map = $ ->
            myOptions =
                center: new google.maps.LatLng( 40.8, -73.9 )
                zoom: 8
                mapTypeId: google.maps.MapTypeId.ROADMAP
            map = new google.maps.Map $('#mapref')[0], myOptions
    
        @connect()
    
    # View definition
    @view index: ->
        head ->
            title 'Index'
            script src: '/socket.io/socket.io.js'
            script src: '/zappa/jquery.js'
            script src: '/zappa/sammy.js'
            script src: '/zappa/zappa.js'
            script src: '/index.js'
            script src: 'http://maps.googleapis.com/maps/api/js?key=AIzaSyBGVLJbZMMkRIyynP4HhG36iGA8z_sloj8&sensor=false'
        body ->
            div id: 'mapref', style: 'width:100%; height:100%'
