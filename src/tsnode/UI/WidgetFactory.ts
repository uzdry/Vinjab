///<reference path="/typings/backbone/backbone.d.ts" />
///<reference path="Widget.ts" />
///<reference path="Dashboard.ts" />
///<reference path="DataModel.ts" />

var widgetPrototypes: { [id: string] : Widget; } = {};


class WidgetFactory{

    createWidget(WidgetID: string, SignalID: string){
        var prototype: Widget = widgetPrototypes[WidgetID];
        var model: DataModel = dataCollection.get(SignalID);

        if(model != null && prototype != null){
            var widget: Widget = new prototype(SignalID);
        }
    }

    addWidget(widget: Widget){
        widgetPrototypes[widget.tagName] = widget;
    }

}

