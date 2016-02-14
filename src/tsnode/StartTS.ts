import {Source} from "./Source";
import {BusDevice} from "./Bus";
import {Topic, Message} from "./messages";
import * as DBAccess from "./DBAccess";
import {FuelConsumption, Distance} from "./AggregatedFunctions";
import {Proxy} from "./Proxy"
import {Server} from "./Server";
import {DBBusDevice} from "./DBAccess";
import {AverageComputation} from "./AggregatedFunctions";

//var terProx: Proxy = new Proxy();
//terProx.subscribe(Topic.SPEED);

var server = new Server();

var sources: Array<BusDevice> = new Array<BusDevice>();


for (var i = 0; i < Topic.VALUES.length; i++) {
    if (Topic.VALUES[i].name.startsWith("values.avg") ||Topic.VALUES[i].name.startsWith("values.aggregated")) {
       continue;
    }
    var s: Source = new Source(Topic.VALUES[i], i);
    s.fire();
    sources.push(s);
}

sources.push(new FuelConsumption());
sources.push(new Distance());
sources.push(new AverageComputation(Topic.SPEED));
sources.push(new AverageComputation(Topic.FUEL_CONSUMPTION));






