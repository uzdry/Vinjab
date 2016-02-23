import {BusDevice} from "./Bus";
import {ValueAnswerMessage, DBRequestMessage, Message, ValueMessage, Topic} from "./messages";
import {Server} from "./Server";
import {Utils} from "./Utils";
import {ReplayValueMessage} from "./messages";

/// <reference path="../../typings/socket.io/socket.io.d.ts"/>

class Proxy extends BusDevice {

    private socket;
    private user: string;
    private replayState: boolean;
    private subscriptions:{[id: string]: boolean} = {};

    constructor(pSocket) {
        super();
        this.socket = pSocket;
        this.subscribe(Topic.STEERING);
    }

    public subscribe(t: Topic){
        super.subscribe(t);
        this.subscriptions[t.getName()] = true;

    }

    public unsubscribe(t: Topic){
        super.unsubscribe(t);
        delete this.subscriptions[t.getName()];
    }

    public setUser(user: string){
        this.user = user;
    }

    public setReplayState(replayState: boolean){
        this.replayState = replayState;
    }
    /**
     * Distribute the message to the end devices
     * @param message the message should be delivered
     * @param socket the connection
     */
    public handleMessage(message: Message): void {
        //Check if the device is currently in replay mode
        if(this.replayState){

            // Don't allow normal values
            if(Utils.startsWith(message.topic.name, "value")) return;

            // Only Replay values
            if(message.topic.getName() === "replay answer") {

                var msg = <ReplayValueMessage> message;

                if (msg.caller === this.user && this.subscriptions[msg.topic.name]){

                    this.socket.emit("message", JSON.stringify(msg.valueMessage));
                    //console.log(JSON.stringify(msg.valueMessage));


                }

            }
            return;
        }

        this.socket.emit("message", JSON.stringify(message));
    }



}

export {Proxy}
