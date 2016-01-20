///<reference path="../../typings/node/node.d.ts"/>
import {BusDevice, Message, ValueMessage, Topic, Broker}  from "./Bus";
import {Value} from "./Utils";
import * as Event from 'events'

/**
 * Created by valentin on 12/01/16.
 */


class Source extends BusDevice {

    private cnt: number = 0;
    value: Value;
    private topic: Topic;

    constructor() {
        super();
        this.value = new Value(this.cnt++, 'km/h');
        setInterval(this.update, 500);
    }

    public update(): void {
        this.value = new Value(this.cnt++, 'km/h');
        var m: Message = new ValueMessage(Topic.SPEED, this.value);
        Broker.get().distribute(m);
    }


    public handleMessage(m: Message): void {

    }

    public publish(t: Topic): void {
        var m: Message = new ValueMessage(t, this.value);
        Broker.get().distribute(m);
    }

}

class TerminalProxy extends BusDevice {

    public handleMessage(m: Message) {
        console.log(m.getTopic());
    }

}

export {Source, TerminalProxy};
