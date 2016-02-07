/**
 * Created by valentin on 2/4/16.
 */

/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./messages";
import{Proxy} from "./Proxy";


class Server {

    private app;
    private io;

    constructor() {

        var express = require('express');
        this.app = express();
        var http = require('http').Server(this.app);

        http.setMaxListeners(100);

        this.io = require('socket.io')(http);

        this.app.use(express.static(__dirname + '/../..'));
        this.app.use(express.static(__dirname + '/../'));
        this.app.use(express.static(__dirname + '/ui' ));
        this.app.use(express.static(__dirname + '/widgets' ));
<<<<<<< HEAD
        this.app.use(express.static(__dirname + '/settings'))
=======
        this.app.use(express.static(__dirname + '/settings'));
>>>>>>> 787875892866785adce68d5c893bf4b7af074f3c

        this.app.get('/ui', function(req, res){
            res.sendFile(__dirname + '/ui/index.html');
        });

        this.app.get('/setting', function(req, res){
            res.sendFile(__dirname + '/settings/test.html');
        });


        this.io.on('connection', function(socket){
            console.log('a user connected ' + socket.id);
            var p = new Proxy(socket);

            socket.on('disconnect', function(){
                console.log('user disconnected');
            });

<<<<<<< HEAD
            socket.on('messagets', function(msg) {
                p.subscribe(new Topic(200, msg));
            });

=======
            socket.on('subscribe', function(msg) {
                p.subscribe(new Topic(200, msg));
            });

            socket.on('unsubscribe', function(msg) {
                p.unsubscribe(new Topic(200, msg));
            });

>>>>>>> 787875892866785adce68d5c893bf4b7af074f3c
            socket.on('createChannel', function (){
                console.log('ch created' + p);
            });

        });

        http.listen(3000, function(){
            console.log('listening on *:3000');
        });

    }

}

export {Server}
