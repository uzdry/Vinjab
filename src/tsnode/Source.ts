
import {BusDevice, Message} from "./Bus";
/**
 * Created by valentin on 12/01/16.
 */


class Source extends BusDevice {
    constructor() {
        super();
    }

    public handleMessage(m: Message): void {

    }

}

export {Source};
