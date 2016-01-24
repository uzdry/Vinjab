import * as Bus from "./Bus";
/**
 * Created by yimeng on 17/01/16.
 */
/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

class Proxy extends Bus.BusDevice{

    /**
     * public constructor, set a server connection to the client
     */
    constructor() {
        super();

        var express = require('express');
        var app = express();
        var http = require('http').Server(app);
        var io = require('socket.io')(http);


        app.use(express.static(__dirname ));
        app.use(express.static(__dirname + '/src'));
        app.use(express.static(__dirname + '/src/tsnode/ui' ));
        app.use(express.static(__dirname + '/src/tsnode/ui/widgets' ));
        app.use(express.static(__dirname + '/src/tsnode/settings'))

        app.get('/ui', function(req, res){
            res.sendFile(__dirname + '/src/tsnode/ui/index.html');
        });

        app.get('/setting', function(req, res){
            res.sendFile(__dirname + '/src/tsnode/settings/test.html');
        });


        io.on('connection', function(socket){
            console.log('a user connected');

            socket.on('disconnect', function(){
                console.log('user disconnected');
            });

            socket.on('message', function(msg):string{
                return msg;
            });

            socket.on('createChannel', function (){
                socket.join(socket.id.toString());
            })

        });

        http.listen(3000, function(){
            console.log('listening on *:3000');
        });
    }


    /**
     * Distribute the message to the end devices
     * @param message the message should be delivered
     * @param socket the connection
     */
    public handelMessage(message: string, socket): void {
        socket.to(socket.id.toString()).emit('message', message);
    }

}




