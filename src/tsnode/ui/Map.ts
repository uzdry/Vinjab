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
    gasStations: google.maps.places.PlacesService;


    /** String that is being introduced to the grid */
    htmlElement: string;

    infoWind: google.maps.InfoWindow;

    constructor(options?) {
        super(options);

        this.widgetID = this.typeID + "-" + this.model.id + "-" + GoogleMapWidget.widgetCounter;
        GoogleMapWidget.widgetCounter++;

        this.htmlElement =  '<li id="' + this.widgetID + '1">' +
                            '<div id ="' + this.widgetID + '2" height="400" width="400"></div>' +
                            '</li>';
    }

    initialize(){

    }

    init() {
        var opt: google.maps.MapOptions = {
            center: new google.maps.LatLng(49.012940, 8.424294),
            zoom: 14,
            draggable: false
        };
        this.map = new google.maps.Map(document.getElementById(this.widgetID + '1'), opt);
        /*
        var element = document.getElementById(this.widgetID + "_out");
        element.style.opacity = "0.0";
        this.map = new google.maps.Map(element.getElementsByTagName('div')[0] , opt);
        */

        this.gasStations = new google.maps.places.PlacesService(this.map);
        //to be deleted:
        this.updateValue(5);
        this.infoWind = new google.maps.InfoWindow(this.map);
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
        if(value < 10) {
            if(navigator.geolocation) {
                var pos;
                navigator.geolocation.getCurrentPosition(function(position) {
                    pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.gasStations.nearbySearch({
                        location: pos,
                        radius: 2000,
                        types: ['gas_station']
                    }, function(result, status, pagination) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            for (var i = 0; i < result.length; i++) {
                                var placeLoc = result[i].geometry.location;
                                var marker = new google.maps.Marker({
                                    map: this.map,
                                    position: result[i].geometry.location
                                });
                            }
                        }
                    }.bind(this))
                }.bind(this));
            }
        }
    }

    resize(size_x: number, size_y:number) {
        google.maps.event.trigger(this.map, "resize");
    }

    destroy(){
        super.destroy();
        delete this;
    }
}



export {GoogleMapWidgetConfig}
