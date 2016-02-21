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
        private pComListener : PComListener;
        constructor(pComListener : PComListener) {
            this.pComListener = pComListener;
        }

        public subscribe() : void {
            this.mychannel = postal.channel("values");
            this.mychannel.subscribe("value.steering", this.onMessageReceived.bind(this));
        }

        public onMessageReceived(data) : void {
            if (this.pComListener != null) {
                this.pComListener.onMessageReceived(data);
            }
        }
    }
}

