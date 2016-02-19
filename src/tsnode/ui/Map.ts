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
    typeID:string = "SurroundingsMap";

    /** Main Element of the Widget */
    map:google.maps.Map;

    currentLoc: google.maps.LatLng;
    currentlyLowOnFuel: boolean;

    /** String that is being introduced to the grid */
    htmlElement:string;

    constructor(options?) {
        super(options);

        this.widgetID = this.typeID + "-" + this.model.get("tagName") + "-" + GoogleMapWidget.widgetCounter;
        GoogleMapWidget.widgetCounter++;

        this.htmlElement = '<li id="' + this.widgetID + '"><div ></div></li>';
        /*
        this.htmlElement = '<li id="' + this.widgetID + '">' +
            '<div></div>' +
            '</li>';
        */
    }

    initialize() {
        this.listenTo(this.model, 'change:value', this.updateValue);
    }

    init() {
        this.initMap();
    }

    private handleLocationError(locAvailable:Boolean, pos:google.maps.LatLng) {
        if (locAvailable) {
            console.log("Unfortunately, your location is not available");
        } else {
            console.log("Unfortunately, your browser does not support location");
        }
    }

    render() {

    }

    updateValue() {
        var value = this.model.get("value");

        if(value < 10 && !this.currentlyLowOnFuel) {
            this.currentlyLowOnFuel = true;
            this.findGasStations();
        } else if(value > 10) {
            this.currentlyLowOnFuel = false;
        }
    }

    resize(size_x:number, size_y:number) {
        google.maps.event.trigger(this.map, "resize");
    }

    destroy() {
        super.destroy();
        delete this;
    }

    initMap() {
        this.map = new google.maps.Map(document.getElementById(this.widgetID), {
            center: new google.maps.LatLng(49.013655, 8.4043383),
            zoom: 14,
            draggable: false
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                this.currentLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var marker = new google.maps.Marker({
                    position: this.currentLoc,
                    map: this.map,
                    title: 'current location'
                });

                this.map.setCenter(this.currentLoc);
            }.bind(this), function () {
                this.handleLocationError(true, this.map.getCenter());
            }.bind(this));
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, this.map.getCenter());
        }
    }

    findGasStations() {
        console.log("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
        var service = new google.maps.places.PlacesService(this.map);
        service.nearbySearch({
            location: this.currentLoc,
            radius: 10000,
            types: ['gas_station']
        }, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    this.createMarker(results[i]);
                }
            }
        }.bind(this));
    }


    createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: this.map,
            position: placeLoc
        });

        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.name);
            infowindow.open(this.map, this);
        });
    }
}

export {GoogleMapWidgetConfig}
