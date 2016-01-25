///<reference path="/Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts"/>

import {DBRequestMessage, ValueAnswerMessage, BusDevice, ValueMessage, Topic, Message} from "./Bus";
import {Value} from "./Utils";
import {TlsOptions} from "tls";

class Distance extends BusDevice {
    private currentDistanceInMeters: number;
    private lastTimeInMS: number;
    private lastSpeedInMpS: number;

    /**
     Constructor;
     On init, the old value of distanceinmeters must be fetched from the database and given to the constructor!
     @param oldDistance: number: the distance the vehicle has moved overall since the first system start
     */
    constructor(oldDistance: number) {
        super();
        this.currentDistanceInMeters = oldDistance;
        this.lastTimeInMS = 0;
        this.lastSpeedInMpS = 0;
        this.subscribe(new Topic(140, "SPEED")); //TODO: SPEED.TOPIC
    }

    public handleMessage(m: Message) {
        if ((m instanceof ValueMessage) && m.getTopic().getID() == 140) { //TODO: SPEED.TOPIC
            var currentTime = Date.now();
            var currentSpeed = m.getValue().numericalValue() * 0.2777777778;
            var avgSpeed = 0.5 * this.lastSpeedInMpS + currentSpeed;
            this.currentDistanceInMeters += (currentTime - this.lastTimeInMS) * 0.001 * avgSpeed;
            this.lastTimeInMS = currentTime;
            this.lastSpeedInMpS = m.getValue().numericalValue();
            this.broker.handleMessage(new ValueMessage(new Topic(330, "mileage"), new Value(this.currentDistanceInMeters, "meters"))); //TODO: Distance.Tpoic
        }
    }
}

class AverageSpeed extends BusDevice {
    private avgSpeed: number;
    private numberOfValues: number;

    constructor () {
        super();
        this.avgSpeed = 0;
    }

    public handleMessage(m: Message) {
        if(m instanceof ValueMessage && m.getTopic().getID() == 0) { //TODO: SPEED.TOPIC
            this.numberOfValues++;
            this.avgSpeed = this.avgSpeed * 1-(1/this.numberOfValues) + m.getValue().numericalValue() / this.numberOfValues;
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
                this.currentDistanceInMeters = m.getValue().numericalValue();
            } else if(m.getTopic().getID() == 180) { //TODO: TANKCONTENTS.TOPIC
                this.currentTankContentsInPercent = m.getValue().numericalValue();
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
                var maf = m.getValue().numericalValue();
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

export {FuelConsumption};
