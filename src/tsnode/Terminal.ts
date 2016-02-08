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

    private channelsub;

    private toServerChannel;


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


        this.channelsub = postal.channel("reqsubs");

        var subreq = this.channelsub.subscribe("request.#", this.subscribeFromServer.bind(this));
        var unsubreq = this.channelsub.subscribe("stop.#", this.unsubscribeFromServer.bind(this));

        this.toServerChannel = postal.channel("toServer");
        var subToServer = this.toServerChannel.subscribe("#", this.toServer.bind(this));


    }

    /**
     * send a message to the server that is to be put on the bus
     * @param data the data that is to be send
     */
    public toServer(data){
        console.log(data);
        var msgstr = JSON.stringify(data);
        this.connection.emit('message', msgstr);
    }

    /**
     * send a message to the server.
     * @param message the message, which will be sent.
     */
    public subscribeFromServer(data) {
        this.connection.emit('subscribe', data);
    }

    public unsubscribeFromServer(data) {
        this.connection.emit('unsubscribe', data);
    }



}

export {Terminal}


