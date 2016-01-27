///<reference path="dataCollection.ts" />
///<reference path="widgetFactory.ts" />
///<reference path="grid.ts" />
///<reference path="widgets/speedGaugeWidget.ts" />
///<reference path="widgets/percentGaugeWidget.ts" />
///<reference path="../../../typings/socket.io/socket.io.d.ts" />
///<reference path="widgets/textWidget.ts"/>
///<reference path="../Terminal.ts"/>


//import Terminal from "../Terminal";





class Dashboard{
    /** MVC Stuff */
    dataCollection: DataCollection = new DataCollection();

    /** Widget Stuff */
    widgetFactory: WidgetFactory = new WidgetFactory();
    grid: Grid = new Grid();


    selector:HTMLSelectElement = <HTMLSelectElement>document.getElementById("WidgetSelect");
    idSelector:HTMLSelectElement = <HTMLSelectElement>document.getElementById("valueSelect");
    button:HTMLButtonElement = <HTMLButtonElement>document.getElementById("addButton");

    options:string[];

    /** Cookie Stuff */
    cookie: string;


    constructor(){
        this.dataCollection = new DataCollection();
        this.widgetFactory = new WidgetFactory();
        this.grid = new Grid();

        //Add all default widgets
        this.widgetFactory.addWidget(new SpeedGaugeWidgetConfig());
        this.widgetFactory.addWidget(new TextWidgetConfig());
        this.widgetFactory.addWidget(new PercentGaugeWidgetConfig());

        this.cookie = Dashboard.getCookie("user");

        if(this.cookie === ""){
            document.cookie = "user=idiot";
        }
    }

    test(){
        var dataModel: DataModel = new DataModel({id: 12});
        this.dataCollection.add(dataModel);

        var widget = this.widgetFactory.createWidget("SpeedGauge", this.dataCollection.get(12));
        this.grid.addWidget(widget);

        var cnt: number = 0;

        setInterval(function(){dataModel.set("value", cnt++);}, 500);

    }

    decodeMessage(s:string){


        var message = JSON.parse(s);

        var model: DataModel = this.dataCollection.get(message.topic.id);

        if(!model){
            model = new DataModel({id: message.topic.id});
            this.dataCollection.add(model);

            var c = document.createElement("option");
            c.text = message.topic.name;
            this.idSelector.options.add(c);
        }

        model.set({value: message.value.value, name: message.topic.name, unit: message.value.identifier});

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

    click(){
        var valueName = this.idSelector[this.idSelector.selectedIndex].text;

        var widget = this.widgetFactory.createWidget(this.selector[this.selector.selectedIndex].text,
            this.dataCollection.where({name: valueName})[0]);
        this.grid.addWidget(widget);
    }

}



var dashboard: Dashboard = new Dashboard();
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
