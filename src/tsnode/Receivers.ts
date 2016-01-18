import {BusDevice, Message, ValueMessage} from "./Bus";
class TerminalProxy extends BusDevice {
    public handleMessage(m: Message) {
        if (m instanceof ValueMessage) {
            console.log(m.getValue());
        }
    }
}
export {TerminalProxy}
