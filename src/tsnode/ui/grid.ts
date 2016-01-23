/// <reference path="../../../typings/jquery.gridster/gridster.d.ts" />
/// <reference path="../../../typings/socket.io/socket.io.d.ts" />
/// <reference path="widget.ts" />

class Grid {
    gridster : Gridster;

    widgets: {[id: string]: Widget; } = {};

    constructor(){

        this.gridster = $(".gridster ul").gridster({widget_base_dimensions: [100, 100],
            widget_margins: [5, 5]}).data('gridster');


    }

    addWidget(widget: Widget){

        widget.htmlWrapper = this.gridster.add_widget(widget.htmlElement, 2, 2);

        widget.init();


    }

}

