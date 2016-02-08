
import {DBRequestMessage, ValueAnswerMessage, ValueMessage, Value, Topic, Message} from "./messages";
import {BusDevice} from "./Bus";
import {TlsOptions} from "tls";

class Distance extends BusDevice {
    private currentDistanceInMeters: number;
    private lastTimeInMS: number;
    private lastSpeedInMpS: number;

    constructor() {
        super();
        this.currentDistanceInMeters = 0;
        this.lastTimeInMS = 0;
        this.lastSpeedInMpS = 0;
        this.subscribe(Topic.SPEED);
    }

    public handleMessage(m: Message) {
        if ((m instanceof ValueMessage) && m.getTopic() == Topic.SPEED) {
            var currentTime = Date.now();
            var currentSpeed = m.value.numericalValue() * 0.2777777778;
            var avgSpeed = 0.5 * this.lastSpeedInMpS + currentSpeed;
            this.currentDistanceInMeters += (currentTime - this.lastTimeInMS) * 0.001 * avgSpeed;
            this.lastTimeInMS = currentTime;
            this.lastSpeedInMpS = m.value.numericalValue();
            this.broker.handleMessage(new ValueMessage(Topic.MILEAGE, new Value(this.currentDistanceInMeters, "meters")));
        }
    }
}

class AverageSpeed extends BusDevice {
    private avgSpeed: number;
    private numberOfValues: number;

    constructor () {
        super();
        this.avgSpeed = 0;
        this.subscribe(Topic.SPEED)
    }

    public handleMessage(m: Message) {
        if(m instanceof ValueMessage && m.getTopic() == Topic.SPEED) {
            this.numberOfValues++;
            this.avgSpeed = this.avgSpeed * 1-(1/this.numberOfValues) + m.value.numericalValue() / this.numberOfValues;
            this.broker.handleMessage(new ValueMessage(Topic.AVG_SPEED, new Value(this.avgSpeed, "Km/h")));
        }
    }
}

class AvgFuelConsumption extends BusDevice {
    private avgFuelConsumption: number;
    private currentDistanceInMeters: number;
    private currentTankContentsInPercent: number;

    constructor() {
        super();
        this.avgFuelConsumption = 0;
        this.currentDistanceInMeters = 0;
        this.currentTankContentsInPercent = 0;
    }

    public handleMessage(m: Message) {
        if(m instanceof ValueMessage) {
            if(m.getTopic().getID() == 330 ) { //TODO: DISTANCE.TOPIC
                this.currentDistanceInMeters = m.value.numericalValue();
            } else if(m.getTopic().getID() == 180) { //TODO: TANKCONTENTS.TOPIC
                this.currentTankContentsInPercent = m.value.numericalValue();
            }
        }
    }
}

class AverageComputation extends BusDevice {
    avgOf: Topic;

    constructor(t: Topic) {
        super();
        this.avgOf = t;
        this.subscribe(t);
    }

    public handleMesage(m: Message) {
        if (m instanceof ValueMessage) {
            if (m.getTopic().getID() == this.avgOf.getID()) {

            }
        }
    }
}

class FuelConsumption extends BusDevice {

    lph: number;
    speed: number;
    lphkm: number;


    constructor() {
        super();
        this.lph = 10;
        this.speed = 10;
        this.lphkm = 10;
    }

    public init() {
        this.subscribe(Topic.SPEED);
        this.subscribe(Topic.MAF);
    }

    public handleMessage(m: Message) {
        if (m instanceof ValueMessage) {
            // Mass Air Flow in gramms per second
            if (m.getTopic().getID() == 350) {
                var maf = m.value.numericalValue();
                this.lph = (maf / 14.7 / 750) * 3600; //liter
            }
            // vehicle speed
            else {
                if (m.getTopic().getID() == 140) {
                    this.lphkm = this.lph / this.speed;
                }
            }
        }
        this.broker.handleMessage(new ValueMessage(Topic.FUEL_CONSUMPTION_H, new Value(this.lph, 'lph')));
        this.broker.handleMessage(new ValueMessage(Topic.FUEL_CONSUMPTION, new Value(this.lphkm, 'l/100km')));
    }
}

export {FuelConsumption, AverageSpeed, AvgFuelConsumption, Distance};
