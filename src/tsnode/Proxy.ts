import * as Bus from "./Bus";
/**
 * Created by yimeng on 17/01/16.
 */
/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

class Proxy extends Bus.BusDevice{

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


        this.app.use(express.static(__dirname ));
        this.app.use(express.static(__dirname + '/src'));
        this.app.use(express.static(__dirname + '/src/tsnode/ui' ));
        this.app.use(express.static(__dirname + '/src/tsnode/ui/widgets' ));
        this.app.use(express.static(__dirname + '/src/tsnode/settings'))

        this.app.get('/ui', function(req, res){
            res.sendFile(__dirname + '/src/tsnode/ui/index.html');
        });

        this.app.get('/setting', function(req, res){
            res.sendFile(__dirname + '/src/tsnode/settings/test.html');
        });


        this.io.on('connection', function(socket){
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
    public handelMessage(message: Bus.Message): void {
        this.io.on('connection', function (socket) {
            socket.to(socket.id.toString()).emit('message', JSON.stringify(message));
        })
    }

}




