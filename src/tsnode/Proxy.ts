import {BusDevice} from "./Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./messages";

/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

class Proxy extends BusDevice {

    /**
     * public constructor, set a server connection to the client
     */
    private app;
    private io;


    constructor() {
        super();

        var express = require('express');
        this.app = express();
        var http = require('http').Server(this.app);

        http.setMaxListeners(10000);

        this.io = require('socket.io')(http);

        this.app.use(express.static(__dirname + '/../..'));
        this.app.use(express.static(__dirname + '/../'));
        this.app.use(express.static(__dirname + '/ui' ));
        this.app.use(express.static(__dirname + '/widgets' ));
        this.app.use(express.static(__dirname + '/settings'))

        this.app.get('/ui', function(req, res){
            res.sendFile(__dirname + '/ui/index.html');
        });

        this.app.get('/setting', function(req, res){
            res.sendFile(__dirname + '/settings/test.html');
        });


        this.io.on('connection', function(socket){
            console.log('a user connected');

            socket.on('disconnect', function(){
                console.log('user disconnected');
            });

            socket.on('message', function(msg):string{
                // console.log(msg);
                return msg;
            });

            socket.on('createChannel', function (){
                this.id = socket.id.toString();
                socket.join(socket.id.toString());
                console.log('ch created');
            })

        });

        http.listen(3000, function(){
            console.log('listening on *:3000');
        });

//        this.subscribe(Topic.SETTINGS_MSG);
//        this.subscribe(Topic.SPEED);
    }


    /**
     * Distribute the message to the end devices
     * @param message the message should be delivered
     * @param socket the connection
     */
    public handleMessage(message: Message): void {
        /*  this.io.on('connection', function (socket) {
         socket.to(socket.id.toString()).emit('message', JSON.stringify(message));
         });*/

        this.io.sockets.send(JSON.stringify(message));
        //    this.io.to(this.id).emit('message', JSON.stringify(message));
    }



}

export {Proxy}
