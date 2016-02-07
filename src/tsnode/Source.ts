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
        setInterval(this.update.bind(this),100);
    }

    private update(): void {
        this.value = new Value((this.cnt+=10) % 200, 'km/h');
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
export {Source};
