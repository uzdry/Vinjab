///<reference path="../../typings/node/node.d.ts"/>


import {BusDevice, Message, ValueMessage, Topic, Broker}  from "./Bus";
import {Value} from "./Utils";


class Source extends BusDevice {

    value: Value;
    topic: Topic;
    cnt: number = 0;


    constructor(pTopic: Topic) {
        super();
        this.value = new Value(0, 'km/h');
        this.cnt = 0;
        this.topic = pTopic;
    }

    public fire() {
        setInterval(this.update.bind(this),500);
    }

    private update(): void {
        console.log('went in');
        this.value = new Value(60, 'km/h');
        var m: Message = new ValueMessage(this.topic, this.value);
        this.broker.handleMessage(m);
    }


    public handleMessage(m: Message): void {

    }

    public publish(t: Topic): void {
        var m: Message = new ValueMessage(t, this.value);
        Broker.get().handleMessage(m);
    }

}

class TerminalProxy extends BusDevice {

    public handleMessage(m: Message) {
        if (m instanceof ValueMessage) {
            console.log(m.getValue().numericalValue());
        }
    }

}

export {Source, TerminalProxy};
