
class Value {
    private value: number;
    private identifier: string;

    constructor(pValue:number, pID: string) {
        this.value = pValue;
        this.identifier = pID;
    }

    public numericalValue(): number {
        return this.value;
    }

}

export {Value}
