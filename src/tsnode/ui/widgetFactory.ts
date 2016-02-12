///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dashboard.ts" />
///<reference path="dataModel.ts" />

import {Dashboard} from "./dashboard";

class WidgetFactory{

    /** All available signals */
    private signalsDesc: {[id: string]: SignalDescription;} = {};
    private signalsReady: boolean = false;
    /** All available widgets */
    private widgetConfigurations: { [id: string] : WidgetConfig; } = {};
    private widgetsReady: boolean = false;

    /** Used DataCollection */
    private dataCollection: DataCollection;

    private dashboard: Dashboard;


    /**
     * The Constructor of the widget factory saves some objects
     * for later use and initiates the reading of the signals-xml
     * @param dataCollection The datacollection with the used data
     * @param dashboard the used dashboard object
     */
    constructor(dataCollection: DataCollection, dashboard: Dashboard){
        this.dataCollection = dataCollection;
        this.dashboard = dashboard;
        this.getSignalsInit();
    }

    /** Creates widget from the serialized config */
    createWidgetFromConfig(conf: WidgetSerConfig):Widget{

        //TODO Rebuild serialize-function to value.name something
        //var model: DataModel = this.dataCollection.getOrCreate(conf.id);

        //return this.createWidgetFromModel(conf.name, model);
        return null;

    }

    /** creates Widget from already existing model */
    createWidgetFromModel(widgetTagName: string, model :DataModel, options?):Widget{
        var widgetConfig = this.widgetConfigurations[widgetTagName];

        if( widgetConfig != null){
            var widget: Widget = widgetConfig.newInstance({model: model});
            return widget;
        }
    }

    /** Creates widget by the signalNumber */
    createWidget(widgetTagName: string, signal: string, options?){
        var widgetConfig = this.widgetConfigurations[widgetTagName];
        var signalConfig = this.signalsDesc[signal];
        var model: Model = this.dataCollection.getOrCreate(signalConfig);

        model.set({name: signalConfig.name, description: signalConfig.description,
            maxValue: signalConfig.maxValue, minValue: signalConfig.minValue});

        if(widgetConfig != null){
            var widget: Widget = widgetConfig.newInstance({model: model});
            return widget;
        }

        return null;
    }

    /** Adds a widget prototype */
    addWidget(widgetConfig: WidgetConfig){
        this.widgetConfigurations[widgetConfig.type_name] = widgetConfig;
        this.dashboard.updateWidgetSelector(this.widgetConfigurations);
    }

    /** Get all available widget options */
    getOptions():{ [id: string] : WidgetConfig;}{
        return this.widgetConfigurations;
    }

    getSignals():{[id: string]: SignalDescription;}{
        if(!this.signalsReady) return null;
        return this.signalsDesc;
    }

    /** Decode all possible signals */
    private getSignalsInit(){
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                this.signal(xhttp);
            }
        }.bind(this);

        xhttp.open("GET", "signals.xml", true);
        xhttp.send();

    }

    /** Decode all signals */
    signal(xhttp: XMLHttpRequest){
        var xmlDoc = xhttp.responseXML;
        var elements = xmlDoc.getElementsByTagName("signal");


        for(var i = 0; i < elements.length; i++){


            var tagName: string = xmlDoc.getElementsByTagName("signal")[i].getAttribute("category");
            var name: string = elements[i].getElementsByTagName("name")[0].textContent;
            var maxValue: number = parseInt(elements[i].getElementsByTagName("maxValue")[0].textContent);
            var minValue: number = parseInt(elements[i].getElementsByTagName("minValue")[0].textContent);
            var desc: string = elements[i].getElementsByTagName("description")[0].textContent;
            this.signalsDesc[tagName] = new SignalDescription(name, tagName, maxValue, minValue, desc);
        }
        this.dashboard.updateSignalSelector(this.signalsDesc);
    }


}

/** The description of a Signal */
class SignalDescription{

    tagName: string;
    name: string;
    maxValue: number;
    minValue: number;
    description: string;


    constructor(name:string, tagName: string, maxValue:number, minValue:number, description:string) {
        this.tagName = tagName;
        this.name = name;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.description = description;
    }
}

export{SignalDescription, WidgetFactory};
