///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="dataModel.ts"/>

abstract class Widget extends Backbone.View<DataModel> {

    /** Widget ID
     * The name of the widget
     * This equals the ID of the HTML-Element*/
    widgetID: string;

    /** Name of the Widget Type */
    typeID: string;

    /** String that is beeing introduced to the grid */
    htmlElement: string;

    /** HTML Grid wrapper */
    htmlWrapper: JQuery;

    /** initialise the widget */
    abstract init();

    /**
     * Gets called by backbone shortly after the constructor.
     * Is supposed to be used for assigning a listenTo function.
     */
    abstract initialize();

    /**
     * Widgets are Elements that are to be shown inside the grid, but may also be used outside of them.
     * Extends Backbone View
     * @param options Options according to the BackboneJS specifics
     */
    constructor(options?){
        super(options);
    }

    /**
     * Gets called when the widget is resized inside of the grid.
     * But may also be used outside of it for resizing the widget.
     * @param size_x New size in pixels in x direction
     * @param size_y New size in pixels in y direction
     */
    abstract resize(size_x: number, size_y: number);

    /**
     * Overwrites the backbone function
     * Helps to keep track of the number of the subscribers to a model.
     * If this is the first subscriber of that value
     * @param object The Object or model to listen to
     * @param events The exact event to listen for
     * @param callback The function that is to be called if event happens
     */
    listenTo(object: any, events: string, callback: Function): any{
        super.listenTo(object, events, callback);
      //  var subCounter = this.model.listeningWidgetsCNT;
        /*if(subCounter <= 0 || subCounter === undefined){
        //    postal.channel("reqsubs").publish("request." + this.model.get("tagName"), this.model.get("tagName"));
            subCounter = 0;
        }*/
        this.model.listeningWidgetsCNT = this.model.listeningWidgetsCNT + 1;
    }

    /**
     * Overwrites the backbone function
     * Helps to keep track of the number of the subscribers of a model
     * If the number of subscribers of that model sinks below 1 it gets destroyed.
     * @param object the object to stop listening to
     */
    stopListening(object: any){
        super.stopListening(object);
        this.model.listeningWidgetsCNT = this.model.listeningWidgetsCNT -1;
        if (this.model.listeningWidgetsCNT < 1) {
            this.model.destroy();
        }
    }

    /**
     * Gets called if the value in the model is updated
     */
    abstract render();

    /**
     * Is used to destroy the Widget
     */
    destroy(){
        this.stopListening(this.model);
    }

    /**
     * If the widget is supposed to be movable itself,
     * not a part inside the widget, you can use this
     * function to notify the widget of this event.
     * @param m true if movable, false if not
     */
    movable(m: boolean){

    }

}

/**
 * The configuration of a widget that is used to add the Widget to the WidgetFactory options
 */
interface WidgetConfig {
    /** The shown name of the WidgetOption */
    "type_name"   : string;
    /** Another possible shown name */
    "display_name"?: string;
    /** An optional description of the widget */
    "description"? : string;

    /** Possible Image as option image */
    "img_src"?: string;

    /**
     * Is used to create a new Widget
     * usually only calls "new ...Widget(config)"
     * @param config Configuration of that widget
     */
    newInstance(config): Widget;
}

/**
 * Class that is used to build the serializable-feature
 */
class WidgetSerConfig{

    name: string;
    size_x: number;
    size_y: number;
    col: number;
    row: number;
    valueID: string;

}
