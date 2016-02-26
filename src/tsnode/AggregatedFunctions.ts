import {DBRequestMessage, ValueAnswerMessage, ValueMessage, Value, Topic, Message} from "./messages";
import {BusDevice} from "./Bus";
import {TlsOptions} from "tls";


interface Aggregation  {

}

class Distance extends BusDevice implements Aggregation{
 //   private currentDistanceInMeters: number;

    private currentValue: number;

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
/**
 * implements the calculation of the average value of goven topic.
 */
class AverageComputation extends BusDevice implements Aggregation {
    avgOf: Topic;
    target: Topic;

    private startTime: number;

    private lastTimeInMS: number;
    private avg: number;


    constructor(t: Topic) {
        super();
        this.avgOf = t;
        this.avg = 0;
        this.startTime = Date.now();
        this.lastTimeInMS = this.startTime;

        var i = t.name.indexOf(".");
        var l = t.name.length;

        this.target = new Topic(t.name.substring(0, i) + ".avg" + t.name.substring(i, l));

        this.subscribe(t);
    }

    public handleMessage(m: Message): void {
        if (m instanceof ValueMessage) {
            var currentTime = Date.now();
            if (!(m.value.value < Number.MAX_VALUE)) {
                return;
            }
            var currentValue = m.value.value;

            var denom = (currentTime - this.startTime);

            if (denom == 0)  {
               return;
            }
            //time weighted average https://www.noisemeters.com/help/osha/twa.asp
            this.avg = ((this.lastTimeInMS - this.startTime) * this.avg + (currentTime - this.lastTimeInMS) * currentValue) / denom;

            this.lastTimeInMS = currentTime;
            this.broker.handleMessage(new ValueMessage(this.target, new Value(this.avg, m.value.identifier)));
        }
    }
}

class FuelConsumption extends BusDevice implements Aggregation {

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
            // Mass Air Flow in grammes per second
            if (m.topic.equals(Topic.MAF)) {
                var maf = m.value.value;
                this.lph = (maf / 14.7 / 750) * 3600; //liter per hour
            }
            // vehicle speed
            else if (m.topic.equals(Topic.SPEED)) {
                this.speed = m.value.value;
                if (this.speed > 0 ) {
                    this.lphkm = (this.lph / this.speed) * 100;
                }
                this.broker.handleMessage(new ValueMessage(Topic.FUEL_CONSUMPTION_PHK, new Value(this.lphkm, 'l/100km')));
                this.broker.handleMessage(new ValueMessage(Topic.FUEL_CONSUMPTION_H,new Value(this.lph, 'l/h')));

            }
        }
    }
}

class FuelDisplay extends BusDevice implements Aggregation {

    fuelph: Value

    constructor() {
        super();
        this.fuelph = new Value(0, 'lph');
        this.subscribe(Topic.FUEL_CONSUMPTION_H);
        this.subscribe(Topic.FUEL_CONSUMPTION_PHK);


    }

    public handleMessage(m: Message) {
        if (m instanceof ValueMessage) {
            // Mass Air Flow in grammes per second
            if (m.topic.equals(Topic.FUEL_CONSUMPTION_PHK)) {
                var value;
                var messageval = m.value.value;
                if (messageval < 40) {
                    value = new Value(messageval, "l/100km");
                } else {
                    value = this.fuelph;
                }

                this.broker.handleMessage(new ValueMessage(Topic.FUEL_CONSUMPTION, value));
            } else if (m.topic.equals(Topic.FUEL_CONSUMPTION_H)) {
                this.fuelph = m.value;
            }
        }
    }

}

class AverageFuelConsumption extends BusDevice implements Aggregation {
    startTime;
    avgFuel;
    avgfuelph: Topic;

    constructor() {
        super();
        this.startTime = Date.now();
        this.subscribe(Topic.AVG_SPEED);
        this.avgFuel = new AverageComputation(Topic.FUEL_CONSUMPTION_H);
        var fuelh = Topic.FUEL_CONSUMPTION_H.name;
        var i = fuelh.indexOf(".");
        var l = fuelh.length;
        this.avgfuelph = new Topic(fuelh.substring(0, i) + ".avg" + fuelh.substring(i, l));
        this.subscribe(this.avgfuelph);

    }

    public handleMessage(m: Message): void {
        if (m instanceof ValueMessage) {
            if (m.topic.equals(this.avgfuelph)) {
                var currentTime = Date.now();
                var currentValue = m.value.value;
            }

            if (m.topic.equals(Topic.AVG_SPEED)) {

            }
        }
    }


}

export {Aggregation, FuelConsumption, FuelDisplay, AverageComputation, Distance};
