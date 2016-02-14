import {BusDevice} from "./Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./messages";
import {Server} from "./Server";

/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

class Proxy extends BusDevice {

    private socket;


    constructor(pSocket) {
        super();
        this.socket = pSocket;
        this.subscribe(Topic.STEERING);
    }


    /**
     * Distribute the message to the end devices
     * @param message the message should be delivered
     * @param socket the connection
     */
    public handleMessage(message: Message): void {
        /*  this.io.on('connection', function (socke‚t) {
         socket.to(socket.id.toString()).emit('message', JSON.stringify(message));
         });*/

      //  this.io.sockets.send(JSON.stringify(message));
        //    this.io.to(this.id).emit('message', JSON.stringify(message));
       this.socket.emit("message", JSON.stringify(message));
      //  console.log(message);
    }



}

export {Proxy}
