// Requires
import {Topic} from "../Bus";
import {ValueMessage} from "../Bus";
import {Value} from "../Utils";
import {Message} from "../Bus";
import {Source} from "../Source";
var express = require('express');
var socketio = require('socket.io');

// Configuration
var appConfig = {
    staticPath:  "../../../"//__dirname // __dirname+'/static'
};

var cnt = 0;
var cnt2 = 0;
var cnt3 = 0;
var cnt4 = 0;
var cnt5 = 0;
var cnt6 = 0;

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
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
        console.log(data);
    });

    socket.on('message', function (msg) {
        console.log(msg);
    });

    setInterval(function () {
        socket.emit('message', JSON.stringify(new ValueMessage(Topic.SPEED, new Value(cnt++, "km/h"))));
        cnt %= 220;
    }, 200);
    setInterval(function(){
        socket.emit('message', JSON.stringify(new ValueMessage(Topic.FUEL, new Value(cnt2++, "%"))));
        cnt2 %= 100;
    }, 100);
    setInterval(function(){
        socket.emit('message', JSON.stringify(new ValueMessage(Topic.STEERING, new Value(cnt3++, "degree"))));
        cnt3 %= 100;
    }, 1000);
    setInterval(function(){
        socket.emit('message', JSON.stringify(new ValueMessage(Topic.TEMPERATURE, new Value(cnt4++, "celcius"))));
        cnt4 %= 100;
    }, 500);
    setInterval(function(){
        socket.emit('message', JSON.stringify(new ValueMessage(Topic.TORQUE, new Value(cnt5++, ""))));
        cnt5 %= 220;
    }, 50);
    setInterval(function(){
        socket.emit('message', JSON.stringify(new ValueMessage(Topic.RUNTIME, new Value(cnt6++, "s"))));
        cnt6 %= 220;
    }, 10);

});


// Listen
server.listen(8000);




