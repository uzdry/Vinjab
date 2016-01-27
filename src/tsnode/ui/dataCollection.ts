///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dataModel.ts" />

var names: string[] = [];

class DataCollection extends Backbone.Collection<DataModel> {

    model = DataModel;

    constructor(options?){
        super(options);

    }

    getAllNames():string[]{
        names = [];
        this.each(this.addName);

        return names;
    }

    addName(m: DataModel){
        names.push(m.get("name"));
    }

}
