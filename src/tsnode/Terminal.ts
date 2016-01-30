/**
 * Created by yimeng on 24/01/16.
 */
/// <reference path="../../typings/socket.io-client/socket.io-client.d.ts"/>
/// <reference path="../../typings/postal/postal.d.ts"/>
import {Message, Value, ValueMessage, Topic} from "./messages";
/**
 * This class is the connection in the client side.
 */
class Terminal {

    /**
     * the connection to the server
     */
    private connection;


    /**
     * public constructor
     */
    constructor() {
  //      this.connection = io();
  //      this.connection.emit('createChannel');

        var channel = postal.channel("forward");

   /*     var msg = this.connection.on('message', function(msg) {
            var message = JSON.parse(msg);
            channel.publish(message.topic.name, {message});
        });*/

        channel.publish("value.speed", new ValueMessage(Topic.SPEED, new Value(123,"dd")));


    }



    /**
     * send a message to the server.
     * @param message the message, which will be sent.
     */
    public sendMessage(message : Message) {
        this.connection.emit('message', JSON.stringify(message));
    }

}

export {Terminal}


