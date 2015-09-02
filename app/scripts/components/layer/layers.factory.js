angular.module('starter')
    .factory('LayerFact', ['$q', 'Settings', 'Debug', '$cordovaBackgroundGeolocation', function($q, Settings, Debug) {
        var observerCallbacks = [];
        //register an observer
        var registerObserverCallback = function(callback) {
            observerCallbacks.push(callback);
        };

        var notifyObservers = function() {
            angular.forEach(observerCallbacks, function(callback){
                var layerId = callback.watch;
                callback.notify(layerId, layer[layerId]);
            });
        };
        var layer = {
            'gpsStorage': null
        }
        var setLayerData = function(layerId, data) {
            layer[layerId] = data;
            notifyObservers();
        }

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
            pushData: pushData,
            observer: registerObserverCallback,
            setLayerData: setLayerData
        }
    }])