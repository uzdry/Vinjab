
///<reference path="../../../typings/backbone/backbone.d.ts" />
/// <reference path="../../../typings/postal/postal.d.ts"/>


//import {ValueMessage} from "../messages";
class DataModel extends Backbone.Model{

    /** The subscription as object so that it can be accessed lateron */
    subscription: ISubscriptionDefinition<any>;

    /**
     * A Datamodel that contains the values received from the Server
     * @param options Options according to the BackboneJS specifications
     */
    constructor(options?){
        super(options);

        var channel = postal.channel("values");;
        this.subscription = channel.subscribe(this.get("tagName"), this.update.bind(this));

        var channelsub = postal.channel("reqsubs");
        var reqsub = channelsub.publish("request." + this.get("tagName"), this.get("tagName"));


    }

    /**
     * Gets called by the PostalBus, changes the current Data
     * @param data The new value
     * @param envelope The envelope according to the BackboneJS specification
     */
    update(data, envelope){
        this.set({value: data.value.value});
    }

}
