///<reference path="../../../typings/backbone/backbone.d.ts" />
/// <reference path="../../../typings/postal/postal.d.ts"/>


//import {ValueMessage} from "../messages";
class DataModel extends Backbone.Model{

    subscription: ISubscriptionDefinition<any>;
    channel: IChannelDefinition<any>;


    constructor(options?){
        super(options);
        this.channel = postal.channel("values");
        this.subscription = this.channel.subscribe("request." + this.get("tagName"), this.update.bind(this));
    }

    update(data, envelope){
        this.set({value: data.value.value});
    }

}
