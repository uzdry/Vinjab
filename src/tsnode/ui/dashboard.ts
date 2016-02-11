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
import {DashboardMessage} from "../messages";
import {WidgetFactory, SignalDescription} from "./widgetFactory";
import {Grid} from "./grid";

class Dashboard{
    /** MVC Stuff */
    dataCollection: DataCollection = new DataCollection();

    /** Widget Stuff */
    widgetFactory: WidgetFactory;
    grid: Grid;

    selector:HTMLSelectElement = <HTMLSelectElement>document.getElementById("WidgetSelect");
    idSelector:HTMLSelectElement = <HTMLSelectElement>document.getElementById("valueSelect");
    button:HTMLButtonElement = <HTMLButtonElement>document.getElementById("addButton");
    deleteCheck: HTMLInputElement = <HTMLInputElement>document.getElementById("cDeleteMode");

    options:string[];

    /** Cookie Stuff */
    cookie: string;


    constructor(){
        this.dataCollection = new DataCollection();
        this.widgetFactory = new WidgetFactory(this.dataCollection, this);
        this.grid = new Grid(this.widgetFactory, this);

        this.cookie = Dashboard.getCookie("user");

        if(this.cookie === ""){
            this.cookie = Dashboard.makeid();
            document.cookie = "user=" + this.cookie;
        }

        var message: DashboardMessage = new DashboardMessage(this.cookie, "", true);
        postal.channel("toServer").publish("", message);
        postal.channel("request").publish("request.#", "dashboard settings from database");

        $(document).on( "click", ".gridster ul li", function() {
            if(document.getElementById("cDeleteMode").checked) {
                $(this).addClass("activ");
                dashboard.grid.gridster.remove_widget($('.activ'));
                dashboard.grid.removeWidget(this.children[0].getAttribute("id"));
            }
        });

        this.button.onclick = this.addWidget.bind(this);
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


    /**
     * Adds a Widget to the Grid
     */
    private addWidget(){
        var signalName = $('#dSignals').data('ddslick');
        var widgetName = $('#dWidgets').data('ddslick');

        if(signalName.selectedIndex < 0) return;
        if(widgetName.selectedIndex < 0) return;

        var widget = this.widgetFactory.createWidget(widgetName.selectedData.value, signalName.selectedData.value);
        this.grid.addWidget(widget);
    }

    /**
     * Updates the Signal selectors
     * @param signals All Signals that are supposed to be shown, not only the new ones
     */
    updateSignalSelector(signals: {[id: string]: SignalDescription;}){
        var signalsData: Array<DDSlickOptions> = [];

        for(var i in signals){
            if(!signals.hasOwnProperty(i)) continue;

            var option = new DDSlickOptions();
            option.text = signals[i].name;
            option.description = signals[i].description;
            option.value = signals[i].tagName;

            signalsData.push(option);
        }

        $('#dSignals').ddslick('destroy');

        //Demo 1---------------------
        $('#dSignals').ddslick({
            data: signalsData,
            selectText: "Select the Signal to be shown"
        });
    }

    /**
     * Updates the widget selectors
     * @param widgets All widgets that are supposed to be shown, not only the new ones
     */
    updateWidgetSelector(widgets: {[id: string]: WidgetConfig;}){
        var widgetData: Array<DDSlickOptions> = [];

        for(var i in widgets){
            if(!widgets.hasOwnProperty(i)) continue;

            var option = new DDSlickOptions();
            option.text = widgets[i].display_name;
            option.description = widgets[i].description;
            option.value = widgets[i].type_name;
            option.imageSrc = widgets[i].img_src;

            widgetData.push(option);
        }

        $('#dWidgets').ddslick('destroy');

        $('#dWidgets').ddslick({
            data: widgetData,
            selectText: "Select the Widget to be shown"
        });
    }

}

class DDSlickOptions{
    text:string;
    value:string;
    description:string;
    imageSrc:string;
}


var terminal = new Terminal();
var dashboard: Dashboard = new Dashboard();
dashboard.widgetFactory.addWidget(new SpeedGaugeWidgetConfig());
dashboard.widgetFactory.addWidget(new TextWidgetConfig());
dashboard.widgetFactory.addWidget(new PercentGaugeWidgetConfig());
dashboard.widgetFactory.addWidget(new LineChartWidgetConfig());

export {DDSlickOptions, Dashboard}
//==========================

