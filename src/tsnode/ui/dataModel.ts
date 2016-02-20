
///<reference path="../../../typings/backbone/backbone.d.ts" />
/// <reference path="../../../typings/postal/postal.d.ts"/>


//import {ValueMessage} from "../messages";
//import {DBRequestMessage} from "../messages";
import {Topic} from "../messages";
class DataModel extends Backbone.Model{

    /** The subscription as object so that it can be accessed lateron */
    subscription: ISubscriptionDefinition<any>;

    /**
     * A Datamodel that contains the values received from the Server
     * @param options Options according to the BackboneJS specifications
     */
    constructor(options?){
        super(options);


        //this.subscription = channel.subscribe(this.get("tagName"), this.update.bind(this));

        var tag = this.get("tagName");

        var model = this;


        setTimeout(function() {
            postal.publish({
                channel: "reqsubs",
                topic: "request." + tag,
                data: {
                    sku: tag,
                    qty: 21 + Date.now()
                }
            });
        }, 0);

        setTimeout(function() {
            postal.subscribe({
                channel: "values",
                topic: tag,
                callback: function(data) {
                    model.set({value: data.value.value});
                }
            });
        }, 0);


    }

    /**
     * Gets called by the PostalBus, changes the current Data
     * @param data The new value
     * @param envelope The envelope according to the BackboneJS specification
     */
    update(data, envelope){
        this.set({value: data.value.value});
    }

    public destroy() {
        var tag = this.get("tagName");
        postal.publish({
            channel: "reqsubs",
            topic: "stop." + tag,
            data: {
                sku: tag,
                qty: 21 + Date.now()
            }
        });
        super.destroy();
    }

}
