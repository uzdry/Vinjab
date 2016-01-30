///<reference path="../../typings/postal/postal.d.ts"/>

/* global postal, $ */
var ch = postal.channel("ft");

var sub = ch.subscribe("value.*", function(data, envelope) {
    console.log("hallo");
});

ch.publish("value.speed");
ch.publish("value.speed");
ch.publish("value.rpm");
ch.publish("value.speed");
