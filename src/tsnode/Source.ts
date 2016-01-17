
import Value from "./Utils";
import {BusDevice, Message, ValueMessage}  from "./Bus";
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

    private publish() {
        super.broker.handleMessage(new ValueMessage(new Value(1,"a")));
    }

}

export {Source};
