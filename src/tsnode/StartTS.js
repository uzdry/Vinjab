///<reference path="/Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts"/>
var Source_1 = require("./Source");
var Bus_1 = require("./Bus");
//import {Iterator} from "../../../../../../../Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6";
var s = new Source_1.Source();
var t = new Bus_1.Topic(0, "test");
s.subscribe(new Bus_1.Topic(0, "aaa"));
var sub = new Set();
for (var i = 0; i < 25; i++) {
    sub.add(new Source_1.Source());
}
console.log('unsubscribe');
var iter = sub[Symbol.iterator]();
//process.exit(1);
