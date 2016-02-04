///<reference path="../../typings/node/node.d.ts"/>


import {BusDevice, Broker}  from "./Bus";
import {Topic, Message, ValueMessage, Value} from "./messages";


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
        setInterval(this.update.bind(this),10);
    }

    private update(): void {
        this.value = new Value(this.cnt++ % 200, 'km/h');
        var m: Message = new ValueMessage(this.topic, this.value);
        this.broker.handleMessage(m);
    }


    public handleMessage(m: Message): void {

    }

    /*
    te
    */
    public publish(t: Topic): void {
        var m: Message = new ValueMessage(t, this.value);
        Broker.get().handleMessage(m);
    }

}

class TerminalProxy extends BusDevice {

    public handleMessage(m: Message) {
        if (m instanceof ValueMessage) {
            console.log(m.value.numericalValue());
        }
    }

}

export {Source, TerminalProxy};
