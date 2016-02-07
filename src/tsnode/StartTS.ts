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


for (var i = 0; i < Topic.VALUES.length; i++) {
    var s: Source = new Source(Topic.VALUES[i]);
    sources.add(s);
    s.fire();
}

console.log(sources);


var iter = sources.values();

var x;
while((x = iter.next().value) != null) {
    x.fire();
}


//console.log("Gokkk");




//process.exit(1);

