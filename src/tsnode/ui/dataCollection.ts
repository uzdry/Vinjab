///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dataModel.ts" />

import Model = Backbone.Model;
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

    getOrCreate(id: number){
        var model:DataModel =this.get(id);
        if(model == undefined){
            model = new DataModel({id: id, value: 0});
            this.add(model);
        }
        return model;

    }

}
