///<reference path="dataCollection.ts" />
///<reference path="widgetFactory.ts" />
///<reference path="grid.ts" />
///<reference path="widgets/speedGaugeWidget.ts" />
///<reference path="widgets/percentGaugeWidget.ts" />
///<reference path="../../../typings/socket.io/socket.io.d.ts" />
///<reference path="widgets/textWidget.ts"/>
///<reference path="../Terminal.ts"/>
///<reference path="widgets/lineChartWidget.ts"/>


import {Terminal} from "../Terminal"


/** Main class that starts the Dashboard */
class Dashboard{

    /** The used dataCollection */
    dataCollection: DataCollection = new DataCollection();

    /** Widget Stuff */
    widgetFactory: WidgetFactory;
    grid: Grid;

    /** Used GUI-Buttons and Elements */
    selector:HTMLSelectElement = <HTMLSelectElement>document.getElementById("WidgetSelect");
    idSelector:HTMLSelectElement = <HTMLSelectElement>document.getElementById("valueSelect");
    button:HTMLButtonElement = <HTMLButtonElement>document.getElementById("addButton");


    /** Cookie Stuff */
    userName: string;


    constructor(){
        this.dataCollection = new DataCollection();
        this.widgetFactory = new WidgetFactory(this.dataCollection, this);
        this.grid = new Grid(this.widgetFactory, this);

        //Add all default widgetsJQuery
        this.widgetFactory.addWidget(new SpeedGaugeWidgetConfig());
        this.widgetFactory.addWidget(new TextWidgetConfig());
        this.widgetFactory.addWidget(new PercentGaugeWidgetConfig());
        this.widgetFactory.addWidget(new LineChartWidgetConfig());

        this.userName = Dashboard.getCookie("user");

        if(this.userName === ""){
            this.userName = Dashboard.makeid();
            document.cookie = "user=" + this.userName;
        }

        console.log("user=" + this.userName);


        this.startSelector();
    }

    static getCookie(cname: string): string {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    static makeid()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    startSelector() {

        //Reset both selectors
        for(var i in this.selector.options){
            this.selector.options.remove(i);
        }
        for(var i in this.idSelector.options){
            this.idSelector.options.remove(i);
        }

        //========= Widgets

        var options:string[] = this.widgetFactory.getOptions();
        for (var i in options) {
            var c = document.createElement("option");
            c.text = options[i];
            this.selector.options.add(c);
        }

        //========= Values

        var names:string[] = this.dataCollection.getAllNames();

        if(!names){
            for (var i in names){
                var c = document.createElement("option");
                c.text = names[i];
                this.idSelector.options.add(c);
            }
        }


        this.button.onclick = this.click.bind(this);

    }

    /** Gets called on AddButtonClick */
    click(){
        var valueName = this.idSelector[this.idSelector.selectedIndex].text;

        var widget = this.widgetFactory.createWidget(this.selector[this.selector.selectedIndex].text,
            parseInt(valueName.split(":")[1]));
        this.grid.addWidget(widget);
    }



}

/** Start the Dashboards */
var terminal = new Terminal();
var dashboard: Dashboard = new Dashboard();

