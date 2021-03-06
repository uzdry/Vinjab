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
///<reference path="../messages.ts" />


class Dashboard{
    /** MVC Stuff */
    dataCollection: DataCollection = new DataCollection();

    /** Widget Stuff */
    widgetFactory: WidgetFactory;
    grid: Grid;

    /** HTML Elements and JQuery elements */
    button:HTMLButtonElement;
    deleteCheck: HTMLInputElement;
    startButton:HTMLButtonElement;
    dSignal:JQuery =  $('#dSignals');
    dWidgets:JQuery = $('#dWidgets');
    dDrives:JQuery = $('#dDrives');

    options:string[];

    /** Cookie Stuff */
    user: string;

    replayState: boolean = false;

    constructor(){

        this.button = <HTMLButtonElement>document.getElementById("addButton");
        this.deleteCheck = <HTMLInputElement>document.getElementById("cDeleteMode");
        this.startButton = <HTMLButtonElement>document.getElementById("bStartReplay");

        this.dataCollection = new DataCollection();
        this.widgetFactory = new WidgetFactory(this.dataCollection, this);
        this.grid = new Grid(this.widgetFactory);

        this.user = Dashboard.getCookie("user");

        if(this.user === ""){
            this.user = Dashboard.makeid();
            document.cookie = "user=" + this.user;
        }

        this.initSubs();

        $(document).on( "click", ".gridster ul li", function() {
            if((<HTMLInputElement>document.getElementById("cDeleteMode")).checked) {
                $(this).addClass("activ");
                dashboard.grid.gridster.remove_widget($('.activ'));
                dashboard.grid.removeWidget(this.children[0].getAttribute("id"));
            }
        });

        this.button.onclick = this.addWidget.bind(this);
        this.startButton.onclick = this.startReplay.bind(this);

        this.initTabs();
    }


    initSubs(){
        var message: DashboardMessage = new DashboardMessage(this.user, "", true);

        postal.publish({
            channel: "reqsubs",
            topic:"request.dashboard settings from database",
            data: {
                sku: "dashboard settings from database",
                qty: 21 + Date.now()
            }
        });

        postal.publish({
            channel: "reqsubs",
            topic:"request.replay information",
            data: {
                sku: "replay information",
                qty: 21 + Date.now()
            }
        });

        postal.channel("values").subscribe("dashboard settings from database", function(data, envelope){
            if(!(data.user === this.user)) return;
            console.log(JSON.stringify(data));
            this.grid.fromSerialized(data.config);
            postal.channel("reqsubs").publish("stop.dashboard settings from database", "dashboard settings from database");
        }.bind(this));

        postal.channel("values").subscribe("replay information", function(data, envelope){
            console.log(data);
            this.updateDrivesSelector(data.finishTime);
        }.bind(this));

        postal.channel("toServer").publish("", message);
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
        console.log("CLICKED");
        var signalName = $("#dSignals").data('ddslick');
        var widgetName = $("#dWidgets").data('ddslick');

        if(signalName.selectedIndex < 0) return;
        if(widgetName.selectedIndex < 0) return;

        var widget = this.widgetFactory.createWidget(widgetName.selectedData.value, signalName.selectedData.value);
        this.grid.addWidget(widget);
    }

    /**
     * Starts the Replay
     */
    private startReplay(){
        var drivesNumber = $('#dDrives').data('ddslick');

        if(drivesNumber.selectedIndex < 0) return;

        var msg: ReplayRequestMessage = new ReplayRequestMessage(drivesNumber.selectedData.value, this.user, !this.replayState);
        this.replayState = !this.replayState;

        if(this.replayState) this.startButton.innerHTML = "Stop";
        else this.startButton.innerHTML = "Start";

        postal.channel("toServer").publish("", msg);
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

        this.dSignal.ddslick('destroy');

        //Demo 1---------------------
        this.dSignal.ddslick({
            data: signalsData,
            selectText: "Select the Signal to be shown",
            onSelected: function(data){
                console.log(data);
                dashboard.updateWidgetSelector(dashboard.widgetFactory.getOptions(data.selectedData.text));
            }
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

        this.dWidgets.ddslick('destroy');

        this.dWidgets.ddslick({
            data: widgetData,
            selectText: "select option",
            defaultSelectedIndex: 0
        });

    }

    /**
     * Updates all drives in the ReplayModus
     * @param drives Array with Objets that contain the length of the drive
     */
    updateDrivesSelector(drives: number[]){
        var drivesOption: Array<DDSlickOptions> = [];

        for(var i in drives){
            if(! drives.hasOwnProperty(i)) continue;

            var option = new DDSlickOptions();
            option.text = "Fahrt: " + i;
            option.description = "Dauer: " + (drives[i]/60000).toFixed(0) + " Minuten";
            option.value = i;

            drivesOption.push(option);
        }

        this.dDrives.ddslick('destroy');

        this.dDrives.ddslick({
            data: drivesOption,
            selectText: 'Wähle die zu anzeigende Fahrt'
        });
    }

    /**
     * Initialise changing the dashboard
     */
    initTabs(){
        this.grid.movable(false);

        $( "#bDashboard" ).click(function() {
            if($("#dEditMode").is(":visible")){
                postal.channel("toServer").publish("" ,new DashboardMessage(this.user, this.grid.serialize(), false));
            }
            this.grid.movable(false);
            this.deleteCheck.checked = false;

            $( "#dDashboard" ).show( "slow" );
            $( "#dSettings").hide("slow");
            $( "#dEditMode").hide("slow");
            $( "#dParkingSensor").hide("slow");
            $( "#dReplayMode").hide("slow");
        }.bind(this));
        $( "#bSettings" ).click(function() {
            $( "#dDashboard" ).hide( "slow" );
            $( "#dSettings").show("slow");
            $( "#dEditMode").hide("slow");
            $( "#dParkingSensor").hide("slow");
            $( "#dReplayMode").hide("slow");
        }.bind(this));
        $( "#bEditMode" ).click(function() {
            $( "#dDashboard" ).show( "slow" );
            $( "#dSettings").hide("slow");
            $( "#dEditMode").show("slow");
            $( "#dParkingSensor").hide("slow");
            $( "#dReplayMode").hide("slow");
            this.grid.movable(true);
        }.bind(this));
        $( "#bParkingSensor").click(function() {
            $( "#dDashboard" ).hide( "slow" );
            $( "#dSettings").hide("slow");
            $( "#dEditMode").hide("slow");
            $( "#dParkingSensor").show("slow");
            $( "#dReplayMode").hide("slow");
            this.grid.movable(false);
        }.bind(this));
        $("#bReplayMode").click(function(){
            this.deleteCheck.checked = false;
            $( "#dDashboard" ).show( "slow" );
            $( "#dSettings").hide("slow");
            $( "#dEditMode").hide("slow");
            $( "#dParkingSensor").hide("slow");
            $( "#dReplayMode").show("slow");
            this.grid.movable(false);
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
    value:any;
    /** the shown description */
    description:string;
    /** the shown picture for each option */
    imageSrc:string;
}


var terminal = new Terminal();
var dashboard: Dashboard = new Dashboard();
dashboard.widgetFactory.addWidget("default", new SpeedGaugeWidgetConfig());
dashboard.widgetFactory.addWidget("default", new TextWidgetConfig());
dashboard.widgetFactory.addWidget("default", new PercentGaugeWidgetConfig());
dashboard.widgetFactory.addWidget("default", new LineChartWidgetConfig());
dashboard.widgetFactory.addWidget("default", new GoogleMapWidgetConfig());


//==========================

