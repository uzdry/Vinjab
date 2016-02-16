///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="dataModel.ts"/>

abstract class Widget extends Backbone.View<DataModel> {

    /** Widget ID */
    widgetID: string;

    /** Name of the Widget Type */
    typeID: string;

    /** String that is beeing introduced to the grid */
    htmlElement: string;

    /** HTML Grid wrapper */
    htmlWrapper: JQuery;

    /** update the shown value */
    abstract updateValue(value: number|boolean);

    /** initialise the widget */
    abstract init();

    /** constructor */
    constructor(options?){
        super(options);
    }

    /** Resize the widgets
     * attributes are the size in pixels*/
    abstract resize(size_x: number, size_y: number);

    listenTo(object: any, events: string, callback: Function): any{
        super.listenTo(object, events, callback);
        var subCounter = this.model.get("subCounter");
        if(subCounter <= 0){
            postal.channel("reqsubs").publish("request." + this.model.get("tagName"), this.model.get("tagName"))
        }
        this.model.set("subCounter", ++subCounter);
    }

    /** Should only be called before destroying the Widget */
    stopListening(object: any){
        super.stopListening(object);
        var subCounter = this.model.get("subCounter");
        if(subCounter <= 1){
            postal.channel("reqsubs").publish("stop." + this.model.get("tagName"), this.model.get("tagName"));
            this.model.destroy();
        }else{
            this.model.set("subCounter", --subCounter);
        }

    }

    abstract render();

    destroy(){
        this.stopListening(this.model);
    }

}

interface WidgetConfig {
    // Same stuff here as with datasource plugin.
    "type_name"   : string; // "my_widget_plugin",
    "display_name"?: string; // "Widget Plugin Example",
    "description"? : string; // "Some sort of description <strong>with optional html!</strong>",

    // **external_scripts** : Any external scripts that should be loaded before the plugin instance is created.
    "external_scripts"?: string[]; // "http://mydomain.com/myscript1.js", "http://mydomain.com/myscript2.js"

    // Possible Image source
    "img_src"?: string;

    // Same as with datasource plugin, but there is no updateCallback parameter in this case.
    newInstance(config): Widget;
}

class WidgetSerConfig{

    name: string;
    size_x: number;
    size_y: number;
    col: number;
    row: number;
    valueID: string;

}
