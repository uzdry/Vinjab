///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dashboard.ts" />
///<reference path="dataModel.ts" />



class WidgetFactory{

    private widgetConfigurations: { [id: string] : WidgetConfig; } = {};

    createWidget(widgetTagName: string, model :DataModel, options?):Widget{
        var widgetConfig = this.widgetConfigurations[widgetTagName];

        if( widgetConfig != null){
            var widget: Widget = widgetConfig.newInstance({model: model});
            return widget;
        }
    }

    addWidget(widgetConfig: WidgetConfig){
        this.widgetConfigurations[widgetConfig.type_name] = widgetConfig;
    }

    getOptions():string[]{
        var array: string[] = [];
        for(var key in this.widgetConfigurations){
            if(!this.widgetConfigurations.hasOwnProperty(key)) continue;
            array.push(key);
        }
        return array;
    }



}

