///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="../../../typings/postal/postal.d.ts"/>


//import {ValueMessage} from "../messages";
class DataModel extends Backbone.Model{

    subscription: ISubscriptionDefinition<any>;
    channel: IChannelDefinition<any>;


    constructor(options?){
        super(options);
        this.channel = postal.channel("values");
<<<<<<< HEAD
        this.subscription = this.channel.subscribe(this.get("tagName"), this.update.bind(this));

        var channelsub = postal.channel("reqsubs");

        var reqsub = channelsub.publish("request." + this.get("tagName"), this.get("tagName"));

=======
        this.subscription = this.channel.subscribe("request." + this.get("tagName"), this.update.bind(this));
>>>>>>> 787875892866785adce68d5c893bf4b7af074f3c
    }

    update(data, envelope){
        if(data.value != null){
            this.set({value: data.value.value});
            var data: any = <Array<number>> this.get("data");
            var time: any = <Array<number>> this.get("time");
            if(data != null){
                data.push(data.value.value);
                time.push(data.value.time);
            }
        }
        if(data.data != null && data.time != null){
            this.set("data", data.data);
            this.set("time", data.time);
        }
    }

}
