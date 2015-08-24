angular.module('starter')
.factory('GeoOperations', [function($q, Settings, Debug) {
        var lineLength = function (geojson) {
            console.log("Geo Operations");
            var gojsonLine = turf.line - distance(geojson);
            console.log(gojsonLine)
        }

        var calcBbox = function (map) {
            var mapCenter = map.project(map.getCenter());
            var downRightCorner = map.unproject([mapCenter.x * 2, mapCenter.y * 2]);
            var upperLeftCorner = map.unproject([0, 0]);
            // South-West-North-East
            var bbox = [downRightCorner.lat, upperLeftCorner.lng, upperLeftCorner.lat, downRightCorner.lng];

            return bbox;
        }

        var getBounds = function(geojson) {
            return turf.extent(geojson);
        }

    return {
        lineLength: lineLength,
        bbox: calcBbox,
        getBounds: getBounds
    }
}]);