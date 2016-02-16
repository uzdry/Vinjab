///<reference path="/Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts"/>
import {DBRequestMessage, ValueAnswerMessage, ValueMessage, Value, Topic, Message} from "./messages";
import {BusDevice} from "./Bus";
import {TlsOptions} from "tls";


class Aggregation extends BusDevice {
    protected currentValue: number;
    constructor() {
        super();
        this.currentValue = 0;
    }
}

class Distance extends Aggregation {
    private currentDistanceInMeters: number;

    private startTime: number;

    private lastTimeInMS: number;

    constructor() {
        super();
        this.currentValue = 0;
        this.startTime = Date.now();
        this.lastTimeInMS = this.startTime;
        this.subscribe(Topic.SPEED);
    }

    public handleMessage(m: Message) {
        if ((m instanceof ValueMessage) && m.topic == Topic.SPEED) {
            var currentTime = Date.now();
            var currentSpeed = m.value.value * 0.2777777778; //speed in m/s

            var delta_t = (currentTime - this.lastTimeInMS) / 1000;

            this.currentValue += delta_t * currentSpeed;

            this.lastTimeInMS = currentTime;

            this.broker.handleMessage(new ValueMessage(Topic.MILEAGE, new Value(this.currentValue / 1000, "km")));

        }
    }
}

/*class AverageSpeed extends BusDevice {
    private avgSpeed: number;
    private numberOfValues: number;

    constructor () {
        super();
        this.avgSpeed = 0;
        this.numberOfValues = 0;
        this.subscribe(Topic.SPEED)
    }

    public handleMessage(m: Message) {
        if(m instanceof ValueMessage && m.getTopic() == Topic.SPEED) {
            this.numberOfValues++;
            this.avgSpeed = this.avgSpeed * 1-(1/this.numberOfValues) + m.value.numericalValue() / this.numberOfValues;
            this.broker.handleMessage(new ValueMessage(Topic.AVG_SPEED, new Value(this.avgSpeed, "Km/h")));
        }
    }
}*/

/*class AvgFuelConsumption extends BusDevice {
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
            if(m.getTopic().getID() == 330 ) {
                this.currentDistanceInMeters = m.value.numericalValue();
            } else if(m.getTopic().getID() == 180) {
                this.currentTankContentsInPercent = m.value.numericalValue();
            }
        }
    }
}*/

/**
 * implements the calculation of the average value of goven topic.
 */
class AverageComputation extends Aggregation {
    avgOf: Topic;

    private startTime: number;

    private lastTimeInMS: number;
    private avg: number;


    constructor(t: Topic) {
        super();
        this.avgOf = t;
        this.avg = 0;
        this.startTime = Date.now();
        this.lastTimeInMS = this.startTime;
        this.subscribe(t);
    }

    public handleMessage(m: Message): void {
        if (m instanceof ValueMessage) {
            if (m.topic.equals(this.avgOf)) {
                var currentTime = Date.now();
                var currentValue = m.value.value;

                var denom = (currentTime - this.startTime);

                this.avg = ((this.lastTimeInMS - this.startTime) * this.avg + (currentTime - this.lastTimeInMS) * currentValue) / denom;

                this.lastTimeInMS = currentTime;


                var i = m.topic.name.indexOf(".");
                var l = m.topic.name.length;
                // pushes avg on bus. uses appropriate Topic name
              //  console.log(m.topic.name.substring(0, i) + ".avg" + m.topic.name.substring(i, l) + this.avg);
                this.broker.handleMessage(new ValueMessage(new Topic(m.topic.name.substring(0, i) + ".avg" + m.topic.name.substring(i, l)), new Value(this.avg, m.value.identifier)));
            }
        }
    }
}

class FuelConsumption extends Aggregation {

    lph: number;
    speed: number;
    lphkm: number;


    constructor() {
        super();
        this.lph = 10;
        this.speed = 10;
        this.lphkm = 10;
        this.init();
    }

    public init() {
        this.subscribe(Topic.SPEED);
        this.subscribe(Topic.MAF);
    }

    public handleMessage(m: Message) {
        if (m instanceof ValueMessage) {
            // Mass Air Flow in gramms per second
            if (m.topic.equals(Topic.MAF)) {
                var maf = m.value.value;
                this.lph = (maf / 14.7 / 750) * 3600; //liter
            }
            // vehicle speed
            else {
                if (m.topic.equals(Topic.SPEED)) {
                    this.speed = m.value.value;
                    this.lphkm = (this.lph / this.speed) * 100;
                }
            }
        }
        this.broker.handleMessage(new ValueMessage(Topic.FUEL_CONSUMPTION_H, new Value(this.lph, 'lph')));
        this.broker.handleMessage(new ValueMessage(Topic.FUEL_CONSUMPTION, new Value(this.lphkm, 'l/100km')));
    }
}

export {Aggregation, FuelConsumption, AverageComputation, Distance};
