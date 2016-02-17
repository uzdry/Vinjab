///<reference path="dataCollection.ts" />
///<reference path="widgetFactory.ts" />
///<reference path="grid.ts" />
///<reference path="widgets/speedGaugeWidget.ts" />
///<reference path="widgets/percentGaugeWidget.ts" />
///<reference path="../../../typings/socket.io/socket.io.d.ts" />
///<reference path="widgets/textWidget.ts"/>
///<reference path="../Terminal.ts"/>
///<reference path="widgets/lineChartWidget.ts"/>
///<reference path="./Map.ts"/>


import {Terminal} from "../Terminal"
import {DashboardMessage} from "../messages";
import {WidgetFactory, SignalDescription} from "./widgetFactory";
import {Grid} from "./grid";
import {GoogleMapWidgetConfig} from "./Map";

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
        this.grid = new Grid(this.widgetFactory);

        this.cookie = Dashboard.getCookie("user");

        if(this.cookie === ""){
            this.cookie = Dashboard.makeid();
            document.cookie = "user=" + this.cookie;
        }

        var message: DashboardMessage = new DashboardMessage(this.cookie, "", true);
        postal.channel("reqsubs").publish("request.dashboard settings from database", "dashboard settings from database");
        postal.channel("values").subscribe("dashboard settings from database", function(data, envelope){
            console.log(data);
            this.grid.fromSerialized(data.config);
        }.bind(this));
        postal.channel("toServer").publish("", message);

        $(document).on( "click", ".gridster ul li", function() {
            if((<HTMLInputElement>document.getElementById("cDeleteMode")).checked) {
                $(this).addClass("activ");
                dashboard.grid.gridster.remove_widget($('.activ'));
                dashboard.grid.removeWidget(this.children[0].getAttribute("id"));
            }
        });

        this.button.onclick = this.addWidget.bind(this);

        this.initTabs();
    }

    /**
     * Returns a certain cookie
     * @param cname the cookie to look for
     * @returns {string} value of the cookie
     */
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

    /**
     * Creates a random five digit id
     * @returns {string} five digit id
     */
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

    /**
     * Initialise changing the dashboard
     */
    initTabs(){
        this.grid.gridster.disable();
        this.grid.gridster.disable_resize();
        $( "#bDashboard" ).click(function() {
            $( "#dDashboard" ).show( "slow" );
            $( "#dSettings").hide("slow");
            $( "#dEditMode").hide("slow");
            $( "#dParkingSensor").hide("slow");
            this.grid.gridster.disable();
            this.grid.gridster.disable_resize();
        }.bind(this));
        $( "#bSettings" ).click(function() {
            $( "#dDashboard" ).hide( "slow" );
            $( "#dSettings").show("slow");
            $( "#dEditMode").hide("slow");
            $( "#dParkingSensor").hide("slow");
        }.bind(this));
        $( "#bEditMode" ).click(function() {
            $( "#dDashboard" ).show( "slow" );
            $( "#dSettings").hide("slow");
            $( "#dEditMode").show("slow");
            $( "#dParkingSensor").hide("slow");
            this.grid.gridster.enable();
            this.grid.gridster.enable_resize();
        }.bind(this));
        $( "#bParkingSensor").click(function() {
            $( "#dDashboard" ).hide( "slow" );
            $( "#dSettings").hide("slow");
            $( "#dEditMode").hide("slow");
            $( "#dParkingSensor").show("slow");
        }.bind(this));
    }

}

/**
 * Class to be used as the options of the ddslick selector
 */
class DDSlickOptions{
    /** the shown text */
    text:string;
    /** the returned value */
    value:string;
    /** the shown description */
    description:string;
    /** the shown picture for each option */
    imageSrc:string;
}


var terminal = new Terminal();
var dashboard: Dashboard = new Dashboard();
dashboard.widgetFactory.addWidget(new SpeedGaugeWidgetConfig());
dashboard.widgetFactory.addWidget(new TextWidgetConfig());
dashboard.widgetFactory.addWidget(new PercentGaugeWidgetConfig());
dashboard.widgetFactory.addWidget(new LineChartWidgetConfig());
dashboard.widgetFactory.addWidget(new GoogleMapWidgetConfig());


//setTimeout(function(){
//    dashboard.grid.fromSerialized('[{"row":1,"col":5,"size_x":7,"size_y":7,"name":"SpeedGauge","valueID":"value.speed"},{"row":1,"col":1,"size_x":4,"size_y":4,"name":"PercentGauge","valueID":"value.speed"},{"row":1,"col":12,"size_x":4,"size_y":4,"name":"TextWidget","valueID":"value.mass air flow"}]');
//}, 1000);


export {DDSlickOptions, Dashboard}
//==========================

