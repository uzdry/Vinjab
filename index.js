/**
 * Created by yimeng on 17/01/16.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname ));
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/src/tsnode/ui' ));
app.use(express.static(__dirname + '/src/tsnode/ui/widgets' ));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/src/tsnode/ui/index.html');
});


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('message', function(msg){
        console.log("Required message : " + msg );

        //processing the message

        io.emit('message', "the asked message (" + msg  + ") is blablabla.");
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
