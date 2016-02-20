/**
 * Created by yimeng on 24/01/16.
 */
/// <reference path="../../typings/socket.io-client/socket.io-client.d.ts"/>
/// <reference path="../../typings/postal/postal.d.ts"/>
import {Message, Value, ValueMessage, Topic} from "./messages";
import {TSConstants} from "./settings/TSettings";
/**
 * This class is the connection in the client side.
 */
class Terminal {

    /**
     * the connection to the server
     */
    private connection;

    private channelsub;

    private channelval;

    private toServerChannel;

    private messageFromServer;


    /**
     * public constructor
     */
    constructor() {

        this.connection = io();
        this.connection.emit('createChannel');

        this.channelsub = postal.channel("reqsubs");

        var subreq = this.channelsub.subscribe("request.#", this.subscribeFromServer.bind(this));
        var unsubreq = this.channelsub.subscribe("stop.#", this.unsubscribeFromServer.bind(this));

        this.toServerChannel = postal.channel("toServer");
        var subToServer = this.toServerChannel.subscribe("#", this.toServer.bind(this));


        this.channelval = postal.channel("values");

        this.connection.on('message', this.incomingMsg.bind(this));

        this.forwardSettingsMsg();

    }

    private forwardSettingsMsg() {
      /*  postal.subscribe({
            channel: TSConstants.db2stChannel,
            topic: TSConstants.db2stTopic,
            callback: function(data) {
                console.log(data);
            }
        });*/

        var schan = postal.channel(TSConstants.db2stChannel);
        var sub = schan.subscribe(TSConstants.db2stTopic, function(data) {
            console.log(data);
        })
    }


    public incomingMsg(msg) {
        var message = JSON.parse(msg);

        //setTimeout(this.synchronousPublish.bind(this), 0, message);
        this.channelval.publish(message.topic.name, message);

    }

    public synchronousPublish(message) {
        this.channelval.publish(message.topic.name, message);


    }
    /**
     * send a message to the server that is to be put on the bus
     * @param data the data that is to be send
     */
    public toServer(data){
        var msgstr = JSON.stringify(data);
        this.connection.emit('message', msgstr);
    }

    /**
     * send a message to the server.
     * @param message the message, which will be sent.
     */
    public subscribeFromServer(data) {
        //console.log(data);
        this.connection.emit('subscribe', data.sku);
    }

    public unsubscribeFromServer(data) {
        this.connection.emit('unsubscribe', data);
    }

}

export {Terminal}


