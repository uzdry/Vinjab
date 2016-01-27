var Value = (function () {
    function Value(pValue, pID) {
        this.value = pValue;
        this.identifier = pID;
    }
    Value.prototype.numericalValue = function () {
        return this.value;
    };
    Value.prototype.getIdentifier = function () {
        return this.identifier;
    };
    return Value;
})();
exports.Value = Value;
