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

        this.connection = io();
        this.connection.emit('createChannel');

        var channel = postal.channel("values");

        var msg = this.connection.on('message', function(msg) {
            var message = JSON.parse(msg);
            channel.publish(message.topic.name, message);
        });

        var channelsub = postal.channel("reqsubs");

        var sub = channelsub.subscribe("request.#", this.sendMessage.bind(this))


    }


    /**
     * send a message to the server.
     * @param message the message, which will be sent.
     */
    public sendMessage(data) {
        this.connection.emit('messagets', JSON.stringify(data));
    }



}

export {Terminal}


