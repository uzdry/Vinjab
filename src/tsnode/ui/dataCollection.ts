///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dataModel.ts" />

import Model = Backbone.Model;

class DataCollection extends Backbone.Collection<DataModel> {

    /** Model type */
    model = DataModel;

    /**
     * Initialises the Collection
     * @param options Options according to the Backbone specification
     */
    constructor(options?){
        super(options);

    }

    /**
     * Searches for a Model with the matching tagName
     * If not found creates Model.
     * @param options The options according to the BackboneJS specification
     * @returns {DataModel} A Datamodel that matches the given options
     */
    getOrCreate(options){
        if (!options) {
            return;
        }
        var model:DataModel = this.findWhere({tagName: options.tagName});
        if(model == undefined){
            model = new DataModel(options);
            this.add(model);
        }

        model.set(options);
        return model;

    }

}
