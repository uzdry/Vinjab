import {Source} from "./Source";
import {Topic, BusDevice, DBRequestMessage} from "./Bus";
import {TerminalProxy} from "./Receivers";
import {DBBusDevice} from "./DBAccess";

var speed: Topic = new Topic(99, "Speed");

var sources: Set<BusDevice> = new Set<BusDevice>();
sources.add(new Source(speed));

var ter: Set<BusDevice> = new Set<BusDevice>();

ter.add(new TerminalProxy());

for (var i = 0; i < 4; i++) {
    ter.add(new TerminalProxy())
}

var db: BusDevice = new DBBusDevice();

db.subscribe(DBRequestMessage.TOPIC);
db.subscribe(speed);


var iter = ter.entries();
var x;
while ((x = iter.next().value) != null) {
    x[0].subscribe(speed);
}
iter = sources.entries();

while ((x = iter.next().value) != null) {
    x[0].publish();
}



//process.exit(1);

