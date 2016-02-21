/// <reference path="../../../typings/jquery.gridster/gridster.d.ts" />
/// <reference path="../../../typings/socket.io/socket.io.d.ts" />
/// <reference path="widget.ts" />
/// <reference path="widgetFactory.ts" />
/// <reference path="dashboard.ts" />

import {WidgetFactory} from "./widgetFactory";
import {Dashboard} from "./dashboard";

class Grid {

    /** gridster instance */
    gridster : Gridster;

    /** size of the atomic elements */
    cube_sizex = 50;
    cube_sizey = 50;

    /** All the widgets in JQuery Object for possible later use */
    widgetsJQuery: {[id: string]: JQuery; } = {};

    /** All the widgets as Widget Object for possible later use*/
    widgets: {[id: string]: Widget; } = {};

    /** Used WidgetFactory */
    widgetFactory: WidgetFactory;

    /**
     * The grid is used to display all widgets
     * @param factory The widget factory that is to be used by the grid
     */
    constructor(factory: WidgetFactory){

        // Save the Objects for later use
        this.widgetFactory = factory;

        // Create the gridster instance
        this.gridster = $(".gridster ul").gridster({
            widget_base_dimensions: [this.cube_sizex, this.cube_sizey],
            widget_margins: [5, 5],
            autogrow_cols: true,
            resize: {
                enabled: true,

                stop: function(e, ui, $widget) {

                    // Show the children again
                    $widget.children().show(0);

                    var outerHTML = $widget[0].outerHTML;
                    var size_x:number = parseInt(outerHTML.match("data-sizex=\"(.*?)\"")[1]);
                    var size_y:number = parseInt(outerHTML.match("data-sizey=\"(.*?)\"")[1]);
                    var name:string = outerHTML.match("id=\"(.*?)\"")[1];

                    this.widgets[name].resize(size_x * this.cube_sizex, size_y * this.cube_sizey);



                }.bind(this),

                start: function(e, ui, $widget) {
                    // Hide the widget until the resizing stops
                    $widget.children().hide(0);
                }
            }
        }).data('gridster');


    }

    /**
     * Remove and destroy a widget from the Grid
     * @param id the identifier of the to be deleted widget
     */
    removeWidget(id: string){
        var widget: Widget = this.widgets[id];
        delete this.widgets[id];
        delete this.widgetsJQuery[id];
        widget.destroy();
    }

    /**
     * Adds a new Widget to the grid
     * @param widget the widget to add
     * @param size_x Optional size of the widget in number of cubes in x-direction, default: 4
     * @param size_y Optional size of the widget in number of cubes in y-direction, default: 4
     * @param col Optional column number , default: 0
     * @param row Optional row number, default: 0
     * @return The added widget to connect function calls
     */
    addWidget(widget: Widget, size_x?:number, size_y?:number, col?:number, row?:number): Widget{

        if (typeof size_x === 'undefined') { size_x = 4; }
        if (typeof size_y === 'undefined') { size_y = 4; }
        if (typeof col === 'undefined') { col = 0; }
        if (typeof row === 'undefined') { row = 0; }

        if (widget) {
            widget.htmlWrapper = this.gridster.add_widget(widget.htmlElement, size_x, size_y, col, row);
            this.widgetsJQuery[widget.widgetID]=widget.htmlWrapper;

            this.widgets[widget.widgetID]=widget;

            widget.init();

            //console.log(this.serialize());

            return widget;
        }


    }

    /**
     * Serializes whole grid
     * @returns {string} A stringified Array of WidgetSerConfig Objects
     */
    serialize(): string{

        var line: string = "[";

        for(var v in this.widgetsJQuery){

            var conf : WidgetSerConfig = new WidgetSerConfig;
            conf.row = parseInt(this.widgetsJQuery[v].attr("data-row"));
            conf.col = parseInt(this.widgetsJQuery[v].attr("data-col"));
            conf.size_x = parseInt(this.widgetsJQuery[v].attr("data-sizex"));
            conf.size_y = parseInt(this.widgetsJQuery[v].attr("data-sizey"));
            conf.name = this.widgetsJQuery[v][0].innerHTML.match("id=\"(.*?)\"")[1].split("-")[0];
            conf.valueID = this.widgetsJQuery[v][0].innerHTML.match("id=\"(.*?)\"")[1].split("-")[1];

            line += JSON.stringify(conf) + ",";

        }
        if(line === ']') return "[]";

        line = line.slice(0, -1) + "]";

        return line;
    }

    /**
     * Fills the Grid from a string
     * @param s A string of WidgetSerConfig objects
     */
    fromSerialized(s: string){
        var widgets: WidgetSerConfig[] = <WidgetSerConfig[]> JSON.parse(s);

        for(var w in widgets){
            // Create new Widget
            var widget: Widget = this.widgetFactory.createWidget(widgets[w].name, widgets[w].valueID);

            // set
            this.addWidget(widget, widgets[w].size_x, widgets[w].size_y, widgets[w].col, widgets[w].row);

            widget.resize(this.cube_sizex * widgets[w].size_x, this.cube_sizey * widgets[w].size_y);

            this.widgetsJQuery[widget.widgetID]=widget.htmlWrapper;
            this.widgets[widget.widgetID]=widget;

            widget.init();

        }
    }

}

export {Grid}


