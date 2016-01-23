// Requires
var express = require('express');
var socketio = require('socket.io');

// Configuration
var appConfig = {
    staticPath:  "../../../"//__dirname // __dirname+'/static'
};

var cnt = 10;


// Application
var app = express();
var server = require('http').createServer(app);
var io = socketio.listen(server);

// Middlewares
app.use(express.static(appConfig.staticPath));
app.use(function(req,res,next){
    res.send(404, '404 Not Found. Sorry.\n');
});

// Socket
io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });

    socket.emit('message', "{\"name\": \"Name\", \"id\": 123, \"value\": 10, \"type\": false, \"maxValue\": 0, \"minValue\": 10}");

    socket.on('message', function(msg){
        console.log(msg );
    });

    setInterval(function(){
        socket.emit('message', "{\"name\": \"Name\", \"id\": 123, \"value\":" + cnt++ + ", \"type\": false, \"maxValue\": 0, \"minValue\": 10}");
    }, 500);
});



// Listen
server.listen(8000);
