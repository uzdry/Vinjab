import {BusDevice} from "./Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./messages";
import {Server} from "./Server";

/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

class Proxy extends BusDevice {

    private socket;


    constructor(pSocket) {
        super();
        this.socket = pSocket;
    }


    /**
     * Distribute the message to the end devices
     * @param message the message should be delivered
     * @param socket the connection
     */
    public handleMessage(message: Message): void {
        /*  this.io.on('connection', function (socket) {
         socket.to(socket.id.toString()).emit('message', JSON.stringify(message));
         });*/

      //  this.io.sockets.send(JSON.stringify(message));
        //    this.io.to(this.id).emit('message', JSON.stringify(message));
       this.socket.send(JSON.stringify(message));
      //  console.log(message);
    }

    public request(message) {
        console.log('msg recieved ' + message);
        this.broker.subscribe(message, this);
    }



}

export {Proxy}
