var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bus_1 = require("./Bus");
/**
 * Created by valentin on 12/01/16.
 */
var Source = (function (_super) {
    __extends(Source, _super);
    function Source() {
        _super.call(this);
    }
    Source.prototype.handleMessage = function (m) {
    };
    return Source;
})(Bus_1.BusDevice);
exports.Source = Source;
