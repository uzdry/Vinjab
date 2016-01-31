///<reference path="../../../typings/backbone/backbone.d.ts" />
///<reference path="widget.ts" />
///<reference path="dashboard.ts" />
///<reference path="dataModel.ts" />



class WidgetFactory{

    /** All available signals */
    private static signalsDesc: {[id: number]: SignalDescription;} = {};
    /** All available widgets */
    private widgetConfigurations: { [id: string] : WidgetConfig; } = {};
    /** Used DataCollection */
    private dataCollection: DataCollection;

    private dashboard;


    constructor(dataCollection: DataCollection, dashboard: Dashboard){
        this.dashboard = dashboard;
        this.dataCollection = dataCollection;

    }

    /** Creates widget from the serialized config */
    createWidgetFromConfig(conf: WidgetSerConfig):Widget{

        var model: DataModel = this.dataCollection.getOrCreate(conf.id);

        return this.createWidgetFromModel(conf.name, model);

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
    createWidget(widgetTagName: string, signalNumber: number, options?){
        var widgetConfig = this.widgetConfigurations[widgetTagName];
        var signalConfig = WidgetFactory.signalsDesc[signalNumber];
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
    }

    /** Get all available widget options */
    getOptions():string[]{
        var array: string[] = [];
        for(var key in this.widgetConfigurations){
            if(!this.widgetConfigurations.hasOwnProperty(key)) continue;
            array.push(key);
        }
        return array;
    }

    /** Decode all possible signals */
    getSignals(){
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

        console.log(elements);

        for(var i = 0; i < elements.length; i++){


            var tagName: string = xmlDoc.getElementsByTagName("signal")[i].getAttribute("category");
            var name: string = elements[i].getElementsByTagName("name")[0].textContent;
            var id: number = parseInt(xmlDoc.getElementsByTagName("signal")[i].getAttribute("id"));
            var maxValue: number = parseInt(elements[i].getElementsByTagName("maxValue")[0].textContent);
            var minValue: number = parseInt(elements[i].getElementsByTagName("minValue")[0].textContent);
            var desc: string = elements[i].getElementsByTagName("description")[0].textContent;
            WidgetFactory.signalsDesc[id] = new SignalDescription(name, tagName, id, maxValue, minValue, desc);
        }

        this.dashboard.setAvailableSignals(WidgetFactory.signalsDesc);
        console.log(WidgetFactory.signalsDesc);
    }


}

/** The description of a Signal */
class SignalDescription{

    tagName: string;
    name: string;
    id: number;
    maxValue: number;
    minValue: number;
    description: string;


    constructor(name:string, tagName: string, id:number, maxValue:number, minValue:number, description:string) {
        this.tagName = tagName;
        this.name = name;
        this.id = id;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.description = description;
    }
}

