angular.module('starter')
.factory('GeoOperations', [function($q, Settings, Debug) {
    var lineLength = function (geojson) {
        console.log("Geo Operations");
        var geoJsonLine = turf.lineDistance(geojson, "kilometers");

        return geoJsonLine;
    }

    var bbox = function(map) {
        var mapCenter = map.project(map.getCenter());
        var downRightCorner = map.unproject([mapCenter.x * 2, mapCenter.y * 2]);
        var upperLeftCorner = map.unproject([0, 0]);
        // South-West-North-East
        var bbox = [downRightCorner.lat, upperLeftCorner.lng, upperLeftCorner.lat, downRightCorner.lng];

        return bbox;
    }

    var getBounds = function(geojson) {
        var turfBounds = turf.extent(geojson);
        var bounds = [[turfBounds[0], turfBounds[1]],[turfBounds[2],turfBounds[3]]];
        return bounds;
    }

    var speedToZoom = function getZoomLevel(speed) {
        var zoomLevel = 17 - speed;
        if(speed > 12) {
            zoomLevel = 12;
        }
        return zoomLevel;
    }

    return {
        lineLength: lineLength,
        bbox: bbox,
        getBounds: getBounds,
        speedToZoom: speedToZoom
    }
}]);