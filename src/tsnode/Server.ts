/**
 * Created by valentin on 2/4/16.
 */

/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./messages";
import {Proxy} from "./Proxy";
import {BusDevice} from "./Bus";
import {Utils} from "./Utils";
import {DashboardMessage} from "./messages";
import {ReplayRequestMessage} from "./messages";
import {SettingsRequestMessage} from "./messages";


class Server extends BusDevice{

    private app;
    private io;

    constructor() {
        super();

        var express = require('express');
        this.app = express();
        var http = require('http').Server(this.app);

        http.setMaxListeners(100);

        this.io = require('socket.io')(http);

        this.app.use(express.static(__dirname + '/../..'));
        this.app.use(express.static(__dirname + '/../'));
        this.app.use(express.static(__dirname + '/ui' ));
        this.app.use(express.static(__dirname + '/widgets' ));
        this.app.use(express.static(__dirname + '/settings'));

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
                p.unsubscribeAll();
            });

            socket.on('message', function(msg){
                console.log(msg);
                var message = JSON.parse(msg);
                if (Utils.startsWith(message.topic.name, 'value.')) {
                    message = new ValueMessage(new Topic(message.topic.name), message.value);
                } else if (Utils.startsWith(message.topic.name, 'dashboard')) {
                    message = new DashboardMessage(message.user, message.config, message.request);
                } else if (Utils.startsWith(message.topic.name, 'replay')) {
                    p.setUser(message.callerID);
                    p.setReplayState(message.startStop);

                    if(message.startStop) p.subscribe(Topic.REPLAY_ANS);
                    else p.unsubscribe(Topic.REPLAY_ANS);

                    message = new ReplayRequestMessage(message.driverNr, message.callerID, message.startStop);
                } else if (Utils.startsWith(message.topic.name, 'settings')) {
                    console.log("OK, dann halt");
                    message = new SettingsRequestMessage(message.topic.name, message.readFromDB);

                } else {
                    return;
                }
                p.broker.handleMessage(message);
            });

            socket.on('subscribe', function(msg) {
                p.subscribe(new Topic(msg));
            });

            socket.on('unsubscribe', function(msg) {
                p.unsubscribe(new Topic(msg));
            });

            socket.on('createChannel', function (){
                console.log('ch created' + p);1
            });

        });

        http.listen(8000, function(){
            console.log('listening on *:8000');
        });

    }
}

export {Server}
