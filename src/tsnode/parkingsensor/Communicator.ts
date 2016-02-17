/**
 * @author David G.
 */

/// <reference path="../../../typings/postal/postal.d.ts"/>

class Communicator {
    private mychannel;
    public subscribe() : void {
        this.mychannel = postal.channel("values");
        this.mychannel.subscribe("value.steering", this.onMessageReceived.bind(this));
    }

    public onMessageReceived(data) : void {
        var msgdiv = document.getElementById("msgDIV");
        msgdiv.innerHTML = "Message received - Communicator.js - ERROR: " + data;
    }
}
