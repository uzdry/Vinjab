///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dataModel.ts" />

class DataCollection extends Backbone.Collection<DataModel> {

    model = DataModel;


    constructor(options?){
        super(options);

    }

}
