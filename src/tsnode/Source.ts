
import {BusDevice, Message, ValueMessage}  from "./Bus";
import Value from "./Utils";
import Topic from "./Bus";
/**
 * Created by valentin on 12/01/16.
 */


class Source extends BusDevice {

    value: Value;

    constructor() {
        super();
    }

    public handleMessage(m: Message): void {

    }

    public publish(t: Topic) {
        var m: Message;
        m = new ValueMessage(t, new Value(1,"a"));
        this.broker.handleMessage(m);
    }

}

export {Source};
