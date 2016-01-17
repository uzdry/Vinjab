var Source_1 = require("./Source");
var Bus_1 = require("./Bus");
//import {Iterator} from "../../../../../../../Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6";
var s = new Source_1.Source();
var t = new Bus_1.Topic(0, "test");
s.subscribe(new Bus_1.Topic(0, "aaa"));
//process.exit(1);
