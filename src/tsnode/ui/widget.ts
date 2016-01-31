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

}

interface WidgetConfig {
    // Same stuff here as with datasource plugin.
    "type_name"   : string; // "my_widget_plugin",
    "display_name"?: string; // "Widget Plugin Example",
    "description"? : string; // "Some sort of description <strong>with optional html!</strong>",

    // **external_scripts** : Any external scripts that should be loaded before the plugin instance is created.
    "external_scripts"?: string[]; // "http://mydomain.com/myscript1.js", "http://mydomain.com/myscript2.js"

    // **fill_size** : If this is set to true, the widget will fill be allowed to fill the entire space given it, otherwise it will contain an automatic padding of around 10 pixels around it.
    "fill_size"? : boolean;

    // Same as with datasource plugin, but there is no updateCallback parameter in this case.
    newInstance(config): Widget;
}

class WidgetSerConfig{

    name: string;
    id: number;
    size_x: number;
    size_y: number;
    col: number;
    row: number;

}
