/**
 * Created by yimeng on 24/01/16.
 */
/// <reference path="../../typings/socket.io-client/socket.io-client.d.ts"/>

/**
 * This class is the connection in the client side.
 */
import {Message} from "./messages";
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




