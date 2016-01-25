///<reference path="dataCollection.ts" />
///<reference path="widgetFactory.ts" />
///<reference path="grid.ts" />
///<reference path="widgets/speedGaugeWidget.ts" />
///<reference path="widgets/percentGaugeWidget.ts" />
///<reference path="../Bus.ts" />
///<reference path="../../../typings/socket.io/socket.io.d.ts" />
///<reference path="widgets/textWidget.ts"/>
///<reference path="/Applications/WebStorm.app/Contents/plugins/JavaScriptLanguage/typescriptCompiler/external/lib.es6.d.ts"/>
///<reference path="../Terminal.ts"/>

//import {Message} from "../Bus";
//import {ValueMessage} from "../Bus";
//import Topic from "../Bus";
//import Terminal from "../Terminal";
import * as Term from "../Terminal";
var terminal = new Term.Terminal();




class Dashboard{
    /** MVC Stuff */
    dataCollection: DataCollection = new DataCollection();

    /** Widget Stuff */
    widgetFactory: WidgetFactory = new WidgetFactory();
    grid: Grid = new Grid();


    selector:HTMLSelectElement = <HTMLSelectElement>document.getElementById("WidgetSelect");
    button:HTMLButtonElement = <HTMLButtonElement>document.getElementById("addButton");
    textField:HTMLInputElement = <HTMLInputElement>document.getElementById("ValueID");

    options:string[];


    constructor(){
        this.dataCollection = new DataCollection();
        this.widgetFactory = new WidgetFactory();
        this.grid = new Grid();

        //Add all default widgets
        this.widgetFactory.addWidget(new SpeedGaugeWidgetConfig());
        this.widgetFactory.addWidget(new TextWidgetConfig());
        this.widgetFactory.addWidget(new PercentGaugeWidgetConfig());

        terminal.sendMessage(new ValueMessage(Topic.SPEED), new Value(144,"v"));

    }

    test(){
        var dataModel: DataModel = new DataModel({id: 12});
        this.dataCollection.add(dataModel);

        var widget = this.widgetFactory.createWidget("SpeedGauge", this.dataCollection.get(12));
        this.grid.addWidget(widget);

        var cnt: number = 0;

        setInterval(function(){dataModel.set("value", cnt++);}, 500);

    }

    decodeValue(s: string){
        var obj:Value = <Value>JSON.parse(s);
        //console.log("" + obj.id + "|" + obj.name + "|" + obj.value );

        var model: DataModel = this.dataCollection.get(obj.id);

        if(!model){
            model = new DataModel({id: obj.id});
            this.dataCollection.add(model);
            //var widget: Widget = this.widgetFactory.createWidget("SpeedGauge", model);
            //this.grid.addWidget(widget);
        }

        model.set({value: obj.value});

    }

    decodeMessage(s:string){
        var message:ValueMessage = <ValueMessage>JSON.parse(s);

        var model: DataModel = this.dataCollection.get(message.getTopic().getID());

        if(!model){
            model = new DataModel({id: message.getTopic().getID()});
            this.dataCollection.add(model);
        }

        model.set({value: message.getValue().numericalValue(), name: message.getValue().getIdentifier()});

    }

    startSelector() {


        var options:string[] = this.widgetFactory.getOptions();
        for (var i in options) {
            var c = document.createElement("option");
            c.text = options[i];
            this.selector.options.add(c);
        }

        this.button.onclick = this.click.bind(this);

    }

    click(){
        var widget = this.widgetFactory.createWidget(this.selector[this.selector.selectedIndex].text,
            this.dataCollection.get(this.textField.value));
        this.grid.addWidget(widget);
    }

}

class Value{
    name:string;
    value:number;
    id: number;
    type:string|boolean;
    maxValue: number;
    minValue: number;
}


var dashboard: Dashboard = new Dashboard();
dashboard.test();
dashboard.startSelector();

//==========================





/** Test Code */
/*
/var widget = widgetFactory.createWidget("GaugeWidget", "123");
grid.addWidget(widget);

var secondWidget = widgetFactory.createWidget("GaugeWidget", "456");
grid.addWidget(secondWidget);

var cnt: number = 0;
setInterval(function(){widget.updateValue(cnt++)}, 500);
*/
