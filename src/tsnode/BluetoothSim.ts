import {BusDevice} from "./Bus"
import {Topic, Value, Message, ValueMessage} from "./messages"

class BluetoothSim extends BusDevice {
    rpm: number
    gasTankpercent: number
    acc: boolean;
    steeringAngle: number
    speed: number;

    constructor() {
        super();

        this.rpm = 1200;
        this.speed = 0

        this.gasTankpercent = 100;

        this.acc = true;

        this.steeringAngle = 0

    }

    public init() {
        setInterval(this.publish.bind(this), 100);
    }

    handleMessage(m: Message): void {


    }

    private publish() {

        if (this.acc) {
            this.broker.handleMessage(new ValueMessage(Topic.RPM, new Value(this.rpm+=5, "rpm")));
            if (this.rpm > 7000) {
                this.acc = false;
            }
        } else {
            this.broker.handleMessage(new ValueMessage(Topic.RPM, new Value(this.rpm-=5, "rpm")));
            if (this.rpm < 1000) {
                this.acc = true;
            }
        }


        this.broker.handleMessage(new ValueMessage(Topic.SPEED, new Value(444 , "km/h")));

        if (this.gasTankpercent > 0) {
            this.broker.handleMessage(new ValueMessage(Topic.FUEL, new Value(this.gasTankpercent -= 1, "percent")));
        } else {
            this.gasTankpercent = 100;
        }

        this.broker.handleMessage(new ValueMessage(Topic.STEERING, new Value(this.steeringAngle+=0.02 % 540, "degrees")));
        this.broker.handleMessage(new ValueMessage(Topic.MAF, new Value(60 , "grams")));
        this.broker.handleMessage(new ValueMessage(Topic.COOLANT_TEMP, new Value(90 , "degrees celsius")));

    }

}

export {BluetoothSim};
