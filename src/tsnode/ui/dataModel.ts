
///<reference path="../../../typings/backbone/backbone.d.ts" />
/// <reference path="../../../typings/postal/postal.d.ts"/>


//import {ValueMessage} from "../messages";
class DataModel extends Backbone.Model{

    subscription: ISubscriptionDefinition<any>;
  //  channel: IChannelDefinition<any>;


    constructor(options?){
        super(options);

        var channel = postal.channel("values");;
        this.subscription = channel.subscribe(this.get("tagName"), this.update.bind(this));

      //  var channelsub = postal.channel("reqsubs");
      //  var reqsub = channelsub.publish("request." + this.get("tagName"), this.get("tagName"));


    }

    update(data, envelope){

        this.set({value: data.value.value});
    }

}
