/**
 * Created by Ray on 14.02.2016.
 */




/**
 * 1:1 import of the class Value.
 */
class Value {
    private value:number;
    private identifier:string;

    constructor(pValue:number, pID:string) {
        this.value = pValue;
        this.identifier = pID;
    }

    public numericalValue():number {
        return this.value;
    }

    public getIdentifier():string {
        return this.identifier;
    }
}
//Topic defines the Topic of a message. BusDevices subscribe to Topics
class Topic {

    static VALUE_MSG =          new Topic("value.*");
    static DBREQ_MSG =          new Topic("database request message");
    static VALUE_ANSWER_MSG =   new Topic("value answer message");
    static SETTINGS_MSG =       new Topic("settings message");

    static SPEED =              new Topic("value.speed");
    static MAF =                new Topic("value.mass air flow");
    static COOLANT_PRESSURE =   new Topic("value.coolant temperature");
    static FUEL_PRESSURE =      new Topic("value.fuel pressure");
    static RPM =                new Topic("value.RPM");
    static STEERING =           new Topic("value.steering");
    static INTAKE_TEMP =        new Topic("value.intake air temperature");
    static ENGINE_RUNTIME =     new Topic("value.engine runtime");
    static FUEL =               new Topic("value.fuel");
    static EGR_STATE =          new Topic("value.exhaust gas recirculation state");
    static INJ_PRESSURE =       new Topic("value.injection pressure State");
    static FPC_STATE =          new Topic("value.fuel pressure control state");
    static GPV =                new Topic("value.gas pressure vaporizer");
    static CAT_TEMP =           new Topic("value.catalyst temperature");
    static THROTTLE =           new Topic("value.throttle");
    static ACCELERATOR =        new Topic("value.accelerator pedal position");
    static TEMP_OUT =           new Topic("value.temperature outside");
    static TORQUE =             new Topic("value.engine torque");
    static EGT =                new Topic("value.exhaust gas temperature");
    static EGP =                new Topic("value.exhaust gas pressure");
    static ULTRASONIC =         new Topic("value.ultrasonic sensor distance");


    static FUEL_CONSUMPTION =   new Topic("value.aggregated.fuel consumption");
    static MILEAGE =            new Topic("value.aggregated.mileage");
    static FUEL_CONSUMPTION_H = new Topic("value.aggregated.fuel per hour");

    static AVG_FUEL =           new Topic("value.avg.aggregated.fuel consumption");
    static AVG_SPEED =          new Topic("value.avg.speed");

    static DASHBOARD_MSG =      new Topic("dashboard settings");
    static DASHBOARD_ANS_MSG =  new Topic("dashboard settings from database");
    static REPLAY_REQ =         new Topic("replay request");
    static REPLAY_ANS =         new Topic("replay answer");
    static REPLAY_INFO =        new Topic("replay information");

    static VALUES: Topic[] = [     Topic.SPEED,
        Topic.MAF,
        Topic.COOLANT_PRESSURE,
        Topic.FUEL_PRESSURE,
        Topic.RPM,
        Topic.STEERING,
        Topic.INTAKE_TEMP,
        Topic.ENGINE_RUNTIME,
        Topic.FUEL,
        Topic.EGR_STATE,
        Topic.INJ_PRESSURE,
        Topic.FPC_STATE,
        Topic.GPV,
        Topic.CAT_TEMP,
        Topic.THROTTLE,
        Topic.ACCELERATOR,
        Topic.TEMP_OUT,
        Topic.TORQUE,
        Topic.EGT,
        Topic.EGP,
        Topic.ULTRASONIC,
        Topic.AVG_FUEL,
        Topic.FUEL_CONSUMPTION,
        Topic.MILEAGE,
        Topic.AVG_SPEED,
        Topic.FUEL_CONSUMPTION_H];

    name:string;

    //instantiates a new Topic with ID and name
    constructor(pName:string) {
        this.name = pName;
    }

    public getName(): string {
        return this.name
    }

    public equals(topic: Topic): boolean {
        return this.name === topic.name;
    }
}

/**
 * 1:1 import of the class Message.
 */
//super class for all Message Types
class Message {
    private topic:Topic;

    constructor(pTopic:Topic) {
        this.topic = pTopic;
    }

    public getTopic():Topic {
        return this.topic;
    }
}

/**
 * 1:1 import of the class SettingsMessage.
 */
/*
 class SettingsMessage extends Message {
 private configs: Map<Topic, Value>;

 constructor(configs : Map<Topic, Value>) {
 super(Topic.SETTINGS_MSG);
 this.configs = configs;
 }

 public getConfigs(): Map<Topic,Value> {
 return this.configs;
 }
 }*/

/**
 * 1:1 import of the class BusDevice.
 */
//A BusDevice has acces to the Bus
abstract class BusDevice {
    broker:Broker;
    private id:number;
    static cnt:number = 0;

    constructor() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }

    public abstract handleMessage(m:Message):void;

    private abstractHandle():void {
        throw new Error('This method is abstract and must be overridden');
    }

    public subscribe(t:Topic) {
        this.broker.subscribe(t, this);
    }

    public subscribeAll(topics: Topic[]): void {
        for (var x in topics) {
            this.broker.subscribe(x, this);
        }
    }

    public unsubscribe(t:Topic) {
        this.broker.unsubscribe(t, this);
    }

    public getID():number {
        return this.id;
    }
}


/**
 * A class that is used instead of Set because of import problems (does not work in the browser).
 */
class AuxiliaryMapBroker {
    topics : Topic[];
    busdevices : AuxiliaryBusDeviceArray[];

    public constructor() {
        this.topics = [];
        this.busdevices = [];
    }

    public get(topic : Topic) : AuxiliaryBusDeviceArray {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            return this.busdevices[index];
        }
        return null;
    }

    public set(topic : Topic, auxiliaryBusDeviceArray : AuxiliaryBusDeviceArray) {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            this.busdevices[index] = auxiliaryBusDeviceArray;
        } else {
            this.topics.push(topic);
            this.busdevices.push(auxiliaryBusDeviceArray);
        }
    }
    private getIndexOf(topic : Topic) : number {
        for (var i = 0; i < this.topics.length; i++) {
            if (this.topics[i].equals(topic)) {
                return i;
            }
        }
        return -1;
    }
}

/**
 * A class that is used instead of Map in Map< Topic, Set<> > because of import problems (does not work in the browser).
 */
class AuxiliaryBusDeviceArray {
    private busDevices : BusDevice[];
    public constructor() {
        this.busDevices = [];
    }

    public push(busdevice : BusDevice) {
        this.busDevices.push(busdevice);
    }

    public remove(sub : BusDevice) {

        var index = -1;
        for (var i = 0; i < this.busDevices.length; i++) {
            if (this.busDevices[i].getID() == sub.getID()) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            this.busDevices.splice(index, 1);
        }
    }

    public getArray() : BusDevice[] {
        return this.busDevices;
    }
}

/**
 * A slightly modified version of the class Broker, it uses the class AuxiliaryMapBroker instead of Map< Topic, Set<> >
 */
class Broker {
    private static instance:Broker;
    private subscribers: AuxiliaryMapBroker;

    constructor() {
        this.subscribers = new AuxiliaryMapBroker();
    }

    public static get():Broker {
        if (Broker.instance == null || typeof Broker.instance == undefined) {
            Broker.instance = new Broker();
        }
        return Broker.instance;
    }

    public handleMessage(m: Message) {
        this.distribute(m);
    }


    public subscribe(topic:Topic, sub:BusDevice):void {
        if (this.subscribers.get(topic) == null) {
            this.subscribers.set(topic, new AuxiliaryBusDeviceArray());
            //console.log('Set created');
        }
        //console.log(sub);
        this.subscribers.get(topic).push(sub);
    }

    public unsubscribe(topic:Topic, sub:BusDevice):void {
        // delete sub
        this.subscribers.get(topic).remove(sub);
    }

    private distribute(m:Message) {
        if (this.subscribers.get(m.getTopic()) == null) {
            //console.log("serious");
            return;
        }

        var arr = this.subscribers.get(m.getTopic()).getArray();

        if (arr != null) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].handleMessage(m);
            }
        }
    }
}

/**
 * The 1:1 import of DBRequestMessage.
 */
class DBRequestMessage extends Message {
    private req: DBRequest;

    constructor(pReq: DBRequest) {
        super(Topic.DBREQ_MSG);
        this.req = pReq;
    }

    public getRequest():DBRequest {
        return this.req
    }
}

/**
 * The 1:1 import of DBRequest.
 */
class DBRequest {
}

/**
 * The 1:1 import of DBSettingsRequest.
 */
class DBSettingsRequest extends DBRequest {

}

/**
 * Emulates the Map used on the server side.
 */
class AuxiliaryMap {
    topics : Topic[];
    values : Value[];

    public constructor() {
        this.topics = [];
        this.values = [];
    }

    public set(topic : Topic, value : Value) : void {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            this.values[index] = value;
        } else {
            this.topics.push(topic);
            this.values.push(value);
        }
    }

    public get(topic : Topic) : Value {
        var index = this.getIndexOf(topic);
        if (index != -1) {
            return this.values[index];
        }
        return null;
    }

    private getIndexOf(topic : Topic) {
        for (var i = 0; i < this.topics.length; i++) {
            if (topic.equals(this.topics[i])) {
                return i;
            }
        }
        return -1;
    }
}


/**
 * The settings message that uses the emulated Map instead of the original one.
 */
class AuxiliarySettingsMessage extends Message {
    private configs: AuxiliaryMap;

    constructor(configs : AuxiliaryMap) {
        super(Topic.SETTINGS_MSG);
        this.configs = configs; //new Map<Topic, Value>();
    }

    public getConfigs(): AuxiliaryMap {
        return this.configs;
    }
}
