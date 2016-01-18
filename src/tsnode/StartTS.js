var Source_1 = require("./Source");
var Bus_1 = require("./Bus");
//import {Iterator} from "../../../../../../../Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6";
var s = new Source_1.Source();
var t = new Bus_1.Topic(0, "test");
s.subscribe(new Bus_1.Topic(0, "aaa"));
var sources = new Set();
sources.add(new Source_1.Source());
sources.add(new Source_1.Source());
sources.add(new Source_1.Source());
sources.add(new Source_1.Source());
var iter = sources.entries();
var x;
while ((x = iter.next().value) != null) {
    x[0].subscribe(t);
}
//process.exit(1);
