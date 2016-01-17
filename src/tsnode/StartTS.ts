///<reference path="/Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts"/>


import {Source} from "./Source";
import {Topic, BusDevice} from "./Bus";
//import {Iterator} from "../../../../../../../Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6";
var s: Source = new Source();
var t: Topic = new Topic(0,"test");

s.subscribe(new Topic(0, "aaa"));

var sub: Set<BusDevice> = new Set<BusDevice>();


for (var i = 0; i < 25; i++) {
    sub.add(new Source());
}


console.log('unsubscribe');

var iter = sub[Symbol.iterator]();





//process.exit(1);

