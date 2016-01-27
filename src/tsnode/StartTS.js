var Source_1 = require("./Source");
var messages_1 = require("./messages");
var AggregatedFunctions_1 = require("./AggregatedFunctions");
var terProx = new Source_1.TerminalProxy();
terProx.subscribe(messages_1.Topic.FUEL_CONSUMPTION);
var sources = new Set();
sources.add(new Source_1.Source(messages_1.Topic.SPEED));
sources.add(new Source_1.Source(messages_1.Topic.MAF));
var af = new AggregatedFunctions_1.FuelConsumption();
af.init();
var iter = sources.values();
var x;
while ((x = iter.next().value) != null) {
    x.fire();
}
//console.log("Gokkk");
//process.exit(1);
