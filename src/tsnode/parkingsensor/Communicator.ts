/**
 * @author David G.
 */

/// <reference path="../../../typings/postal/postal.d.ts"/>
module Communicator {
    export interface PComListener {
        onMessageReceived(data) : void;
    }

    export class PCommunicator {
        private mychannel;
        private divName : string;
        private pComListener : PComListener;
        constructor(divName : string, pComListener : PComListener) {
            this.divName = divName;
            this.pComListener = pComListener;
        }

        public subscribe() : void {
            //var channelsub = postal.channel("reqsubs");
            //var reqsub = channelsub.publish("request." + "value.steering", "value.steering");

            this.mychannel = postal.channel("values");
            this.mychannel.subscribe("value.steering", this.onMessageReceived.bind(this));
        }

        public onMessageReceived(data) : void {
            var msgdiv = document.getElementById(this.divName);
            msgdiv.innerHTML = "SMessage received: " + data.value.value;
            if (this.pComListener != null) {
                this.pComListener.onMessageReceived(data);
            }
        }
    }
}

