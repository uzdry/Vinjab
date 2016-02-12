/// <reference path ="./google.maps.d.ts"/>
/// <reference path ="./widget.ts"/>

class GoogleMapWidgetConfig implements WidgetConfig{

    "type_name" = "SurroundingsMap";

    "display_name" = "Map of Surroundings";

    newInstance(options):Widget {
        return new GoogleMapWidget(options);
    }

}

class GoogleMapWidget extends Widget {

    static widgetCounter: number = 0;

    /** Tag name */
    typeID: string = "SurroundingsMap";

    /** Main Element of the Widget */
    map: google.maps.Map;

    /** String that is being introduced to the grid */
    htmlElement: string;

    infoWind: google.maps.InfoWindow;

    constructor(options?) {
        super(options);

        this.widgetID = this.typeID + "-" + this.model.id + "-" + GoogleMapWidget.widgetCounter;
        GoogleMapWidget.widgetCounter++;

        //Save the HTMLElements
        this.htmlElement = "<div id=\"" + this.widgetID + "\" width=\"400\" height=\"400\"></div>";
    }

    initialize(){

    }

    private updateLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                this.infoWind.setPosition(pos);
                this.infoWind.setContent('You are here');
                this.map.setCenter(pos);
            }.bind(this), function() {
                this.handleLocationError(true, this.infoWind, this.map.getCenter());
            }.bind(this));
        } else {
            // Browser doesn't support location
            this.handleLocationError(false, this.infoWind, this.map.getCenter());
        }
    }

    init() {
        var opt: google.maps.MapOptions = {
            center: new google.maps.LatLng(49.012940, 8.424294),
            zoom: 6,
            draggable: false
        };
        this.map = new google.maps.Map(document.getElementById(this.widgetID), opt);
        this.infoWind = new google.maps.InfoWindow(this.map);
        this.updateLocation();
    }

    private handleLocationError(locAvailable: Boolean, iw: google.maps.InfoWindow, pos: google.maps.LatLng) {
        iw.setPosition(pos);
        if (locAvailable) {
            iw.setContent("Unfortunately, your location is not available");
        } else {
            iw.setContent("Unfortunately, your browser does not support location");
        }
    }

    render() {

    }

    updateValue(value: number){

    }

    resize(size_x: number, size_y:number) {
    }

    destroy(){
        super.destroy();
        delete this;
    }
}

export {GoogleMapWidgetConfig}
