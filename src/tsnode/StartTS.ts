/// <reference path="/home/nutzio/PSE/WebStorm/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts" />
import {Source} from "./Source";
import {BusDevice} from "./Bus";
import {Topic, Message} from "./messages";
import * as DBAccess from "./DBAccess";
import {FuelConsumption} from "./AggregatedFunctions";
import {Proxy} from "./Proxy"
import {Server} from "./Server";

//var terProx: Proxy = new Proxy();
//terProx.subscribe(Topic.SPEED);

var server = new Server();

var sources: Set<BusDevice> = new Set<BusDevice>();

sources.add(new Source(Topic.SPEED));
sources.add(new Source(Topic.MAF));

var af = new FuelConsumption();
af.init();


var iter = sources.values();

var x;
while((x = iter.next().value) != null) {
    x.fire();
}

setInterval(function() {
    console.log(Server.proxies);
}, 2000);


//console.log("Gokkk");




//process.exit(1);

