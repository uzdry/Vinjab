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
            this.avgSpeed = this.avgSpeed * 1-(1/this.numberOfValues) + m.getValue().value / this.numberOfValues;
            this.broker.handleMessage(new ValueMessage(new Topic(42, "Average Speed"), new Value(this.avgSpeed, "Km/h")));
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

class FuelConsumption extends BusDevice {

    maf: number;
    lph: number;
    speed: number;


    constructor() {
        super();
        this.maf = 0;
        this.lph = 0;
        this.speed = 0;
    }

    public init() {
        this.subscribe(new Topic(350, "mass air flow"));
        this.subscribe(new Topic(140, "speed"));
    }

    public handleMessage(m: Message) {
        if (m instanceof ValueMessage) {
            // Mass Air Flow in gramms per second
            if (m.getTopic().getID() == 350) {
                this.maf = m.getValue().numericalValue();
                this.lph = this.maf / 14.7 / 750 * 3600; //liter
            }
            // vehicle speed
            else if (m.getTopic().getID() == 140) {
                var lphkm = this.lph / this.speed * 100;
            }
        }
    }

}
