import * as Bus from "./Bus";
//import SettingsMessage from "./Bus";
//import ValueMessage from "./Bus";
import {BusDevice} from "./Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./messages";

/**
 * Created by yimeng on 17/01/16.
 */
/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

class Proxy extends BusDevice{

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
        this.io = require('socket.io')(http);


        this.app.use(express.static(__dirname + '/../..'));
        this.app.use(express.static(__dirname + '/../'));
        this.app.use(express.static(__dirname + '/ui' ));
        this.app.use(express.static(__dirname + '/widgetsJQuery' ));
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
                console.log(msg);
                return msg;
            });

            socket.on('createChannel', function (){
                socket.join(socket.id.toString());
            })

        });

        http.listen(3000, function(){
            console.log('listening on *:3000');
        });

        this.subscribe(Topic.SETTINGS_MSG);
        this.subscribe(Topic.SPEED);
    }


    /**
     * Distribute the message to the end devices
     * @param message the message should be delivered
     * @param socket the connection
     */
    public handelMessage(message: Message): void {
        this.io.on('', function (socket) {
            socket.to(socket.id.toString()).emit('message', JSON.stringify(message));
        })
    }

}

var proxy = new Proxy();


