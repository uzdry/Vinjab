
///<reference path="../../typings/node/node.d.ts"/>
///<reference path="messages.ts" />
var fs = require('fs');
eval(fs.readFileSync('messages.js')+'');

/*
Template class for a Device that has pub/sub acces to the bus
 */
class BusDevice {
    // handles subscriptions and handles Messages
    broker:Broker;
    // unique ID of BusDevice
    id:number;
    //counts number of BusDevices instanciated
    static cnt:number = 0;

    constructor() {
        this.id = BusDevice.cnt++;
        this.broker = Broker.get();
    }

    /**
     * Handle Message on reception
     * @param m Message
     */
    public handleMessage(m:Message):void {
        this.abstractHandle();
    }

    /**
     * Template for abstraction
     */
    private abstractHandle():void {
        throw new Error('This method is abstract and must be overridden');
    }

    /**
     * add this BusDevice to the List of Subscriptions for specified Topic
     * @param t
     */
    public subscribe(t: Topic) {
        this.broker.subscribe(t.name, this);
    }

    /**
     * set Subscription to alle "value." type topics
     * @param topics
     */
    public subscribeAll(topics: Topic[]): void {
        for (var i in topics) {
            this.broker.subscribe(topics[i].name, this);
        }
    }


    public unsubscribeAll() {
        this.broker.unsubscribeAll(this);
    }

    /**
     * kill subscription to given Topic
     * @param t
     */
    public unsubscribe(t:Topic) {
        this.broker.unsubscribe(t.name, this);
    }
}

/**
 * A Simple Broker tackeling subscriptions of topics and distributing messages accordingly
 */
class Broker {


    private static instance:Broker = new Broker();
  //  private subs: Map<string, Set<BusDevice>>;

    private subscribers: { [topic:string]:Array<BusDevice>; } = {};

    /**
     * For internal calls only
     */
    constructor() {
     //   this.subs = new Map<string, Set<BusDevice>>();
        if (Broker.instance) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.get() instead of new.");
        }
        Broker.instance = this;
    }

    /**
     * This class should only be initialized once;
     * @returns {Broker} instance of a broker;
     */
    public static get():Broker {
        return Broker.instance;
    }

    /**
     * This method handles a Message a BusDevice pushes onto the Bus by distributing the message
     * to all subscriber to the suscribers of its Topic
     * @param m
     */
    public handleMessage(m: Message) {
        this.distribute(m);
    }

    /**
     * adds specified BusDecice to the list of subscribers of specified Topic
     * @param topic
     * @param sub
     */
    public subscribe(topic:string, sub:BusDevice):void {
        if (!this.subscribers[topic]) {
            this.subscribers[topic] = new Array<BusDevice>();
        }
        this.subscribers[topic].push(sub);
    }

    /**
     * delete subscriber from all Topics
     * @param sub
     */
    public unsubscribeAll(sub: BusDevice) {
        for (var i = 0; i < Topic.VALUES.length; i++) {
            if (this.subscribers[Topic.VALUES[i].name]) {
                for (var j = 0; j < this.subscribers[Topic.VALUES[i].name].length; j++) {
                    if (this.subscribers[Topic.VALUES[i].name][j] == sub) {
                        this.unsubscribe(Topic.VALUES[i].name, sub);
                    }
                }
            }
        }
    }

    /**
     * kill subscription of sub to specified Topic
     * @param topic
     * @param sub
     */
    public unsubscribe(topic:string, sub:BusDevice):void {

        var subsOfTopic = this.subscribers[topic];

        if(!this.subscribers[topic]) {
            return;
        }

        var i = this.subscribers[topic].indexOf(sub);
        this.subscribers[topic].splice(i,1);

    }

    getSubscribers(topic: string): Array<BusDevice>  {
        return this.subscribers[topic];
    }

    /**
     * distribute Message to subscriber
     * @param m Message to distribute
     */
    private distribute(m:Message) {
        if (!this.subscribers[m.topic.name]) {
            return;
        }

        for (var i = 0; i < this.subscribers[m.topic.name].length; i++) {
            this.subscribers[m.topic.name][i].handleMessage(m);
        }

    }
}

export {BusDevice, Broker};
