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

    // Widgets in JQuery style
    widgetsJQuery: {[id: string]: JQuery; } = {};

    // widgets as Widget Class
    widgets: {[id: string]: Widget; } = {};

    widgetFactory: WidgetFactory;
    dashboard: Dashboard;

    constructor(factory: WidgetFactory, dashboard: Dashboard){

        // Save the Objects for later use
        this.dashboard = dashboard;
        this.widgetFactory = factory;

        // Create the gridster instance
        this.gridster = $(".gridster ul").gridster({
            widget_base_dimensions: [this.cube_sizex, this.cube_sizey],
            widget_margins: [5, 5],
            resize: {
                enabled: true,

                stop: function(e, ui, $widget) {

                    var outerHTML = $widget[0].outerHTML;
                    var size_x:number = parseInt(outerHTML.match("data-sizex=\"(.*?)\"")[1]);
                    var size_y:number = parseInt(outerHTML.match("data-sizey=\"(.*?)\"")[1]);
                    var name:string = outerHTML.match("id=\"(.*?)\"")[1];

                    dashboard.grid.widgets[name].resize(size_x * dashboard.grid.cube_sizex, size_y * dashboard.grid.cube_sizey);

                    $widget.children().show("fast");

                }.bind(this),

                start: function(e, ui, $widget) {
                    $widget.children().hide("fast");
                }
            }
        }).data('gridster');


    }

    removeWidget(id: string){
        var widget: Widget = this.widgets[id];
        widget.destroy();
    }

    addWidget(widget: Widget, size_x?:number, size_y?:number, col?:number, row?:number){

        if (typeof size_x === 'undefined') { size_x = 4; }
        if (typeof size_y === 'undefined') { size_y = 4; }
        if (typeof col === 'undefined') { col = 0; }
        if (typeof row === 'undefined') { row = 0; }

        widget.htmlWrapper = this.gridster.add_widget(widget.htmlElement, size_x, size_y, col, row);

        this.widgetsJQuery[widget.widgetID]=widget.htmlWrapper;

        this.widgets[widget.widgetID]=widget;

        widget.init();

        console.log(this.serialize());

    }

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

        line = line.slice(0, -1) + "]";

        return line;
    }

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


