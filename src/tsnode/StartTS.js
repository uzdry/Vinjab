var Source_1 = require("./Source");
var Bus_1 = require("./Bus");
var Receivers_1 = require("./Receivers");
var DBAccess_1 = require("./DBAccess");
var speed = new Bus_1.Topic(99, "Speed");
var sources = new Set();
sources.add(new Source_1.Source(speed));
var ter = new Set();
ter.add(new Receivers_1.TerminalProxy());
for (var i = 0; i < 4; i++) {
    ter.add(new Receivers_1.TerminalProxy());
}
var db = new DBAccess_1.DBBusDevice();
db.subscribe(Bus_1.DBRequestMessage.TOPIC);
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
