angular.module('starter')
    .factory('Layers', ['$q', 'Settings', 'Debug', '$cordovaBackgroundGeolocation', function($q, Settings, Debug) {
        var linestring = [];
        var geojson;
        var gpsTrace = function(entries) {
            Debug.trace("drawing gps trace");
            for(var i=0; i<entries.length; i++) {
                var point = [entries[i].lon, entries[i].lat];
                linestring.push(point);
            }
        }

        var getData = function() {
            return turf.linestring(linestring)
        }

        var pushData = function(point) {
            linestring.push(point);
        }

        return {
            gpsTrace: gpsTrace,
            getData: getData,
            pushData: pushData
        }
    }])