/// <reference path ="./google.maps.d.ts"/>

class GoogleMap {
    map: google.maps.Map;
    infoWind: google.maps.InfoWindow;

    constructor() {
        var options: google.maps.MapOptions = {
            center: new google.maps.LatLng(49.012940, 8.424294),
            zoom: 6
        };
        this.map = new google.maps.Map(document.getElementById('map'), options);
        this.infoWind = new google.maps.InfoWindow(this.map);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                this.infoWind.setPosition(pos);
                this.infoWind.setContent('Location found.');
                this.map.setCenter(pos);
            }.bind(this), function() {
                this.handleLocationError(true, this.infoWind, this.map.getCenter());
            }.bind(this));
        } else {
            // Browser doesn't support Geolocation
           this.handleLocationError(false, this.infoWind, this.map.getCenter());
        }
    }

    private handleLocationError(locAvailable: Boolean, iw: google.maps.InfoWindow, pos: google.maps.LatLng) {
        iw.setPosition(pos);
        if (locAvailable) {
            iw.setContent("Location service is not available");
        } else {
            iw.setContent("The Browser does not support location services");
        }
    }
}
