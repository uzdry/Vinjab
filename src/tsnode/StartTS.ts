import {Source} from "./Source";
import {BusDevice} from "./Bus";
import {Topic, Message} from "./messages";
import * as DBAccess from "./DBAccess";
import {FuelConsumption} from "./AggregatedFunctions";
import {Proxy} from "./Proxy"
import {Server} from "./Server";
import {DBBusDevice} from "./DBAccess";

//var terProx: Proxy = new Proxy();
//terProx.subscribe(Topic.SPEED);

var server = new Server();

var sources: Array<Source> = new Array<Source>();


for (var i = 0; i < Topic.VALUES.length; i++) {
    var s: Source = new Source(Topic.VALUES[i], i);
    sources.push(s);
}


for (var i = 0; i < sources.length; i++) {
    sources[i].fire();
}





