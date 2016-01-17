import {Source} from "./Source";
import {Topic, BusDevice} from "./Bus";
//import {Iterator} from "../../../../../../../Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6";
var s: Source = new Source();
var t: Topic = new Topic(0,"test");

s.subscribe(new Topic(0, "aaa"));

var sources: Set<BusDevice> = new Set<BusDevice>();
sources.add(new Source());
sources.add(new Source());
sources.add(new Source());
sources.add(new Source());

for (var i = 0; i < 4; i++) {
    sources.add(new Source());
}

var iter = sources.entries();
var x;

while ((x = iter.next().value) != null) {
    x[0].publish();
}


//process.exit(1);

