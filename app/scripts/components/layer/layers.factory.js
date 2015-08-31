angular.module('starter')
    .factory('LayerFact', ['$q', 'Settings', 'Debug', '$cordovaBackgroundGeolocation', function($q, Settings, Debug, MapServ) {
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

        var addGeojsonLayer = function(layer, visibility) {
            if(visibility === undefined){
                visibility = true;
            }
            var symbolTemplate = {}
            var lineTemplate = {
                "type": 'line',
                "layout": {
                    "visibility": visibility
                },
                "paint": {
                    "line-color": "#ff0000",
                    "line-width": 2
                }
            }
            var fillTemplate = {}

            var style = {
                "location": {
                    "type": 'symbol',
                    "layout": {
                        "icon-image": "circle-12"
                    },
                    "paint": {
                        "icon-size": 1,
                        "icon-color": "#669966"
                    }
                },
                "locationAccuracy": {
                    "type": 'fill',
                    "layout": {
                        "visibility": visibility
                    },
                    "paint": {
                        "fill-outline-color": "#ff0000",
                        "fill-color": "#ff0000",
                        "fill-opacity": 0.2
                    }
                },
                "locationHeading": {
                    "type": 'line',
                    "layout": {
                        "visibility": visibility
                    },
                    "paint": {
                        "line-color": "#ff0000",
                        "line-width": 2
                    }
                },
                "gpsTrace": {
                    "type": 'line',
                    "layout": {
                        "visibility": visibility
                    },
                    "paint": {
                        "line-color": "#ff0000",
                        "line-width": 2
                    }
                },
                "gpsStorage": {
                    "type": 'line',
                    "layout": {
                        "visibility": visibility
                    },
                    "paint": {
                        "line-color": "#ffff00",
                        "line-width": 2
                    }
                }
            }
            data = turf.linestring([0, 0]);
            MapServ.addSource(layer.name, {
                "type": "geojson",
                "data": data
            });

            MapServ.addLayer({
                "id": layer.name,
                "type": style[layer.name].type,
                "source": layer.name,
                "interactive": true,
                "layout": style[layer.name].layout,
                "paint": style[layer.name].paint
            });

            Debug.trace("layer added: "+layer.name);
            $scope.$apply();
        }


        return {
            gpsTrace: gpsTrace,
            getData: getData,
            pushData: pushData,
            observer: registerObserverCallback,
            setLayerData: setLayerData,
            addGeojsonLayer: addGeojsonLayer
        }
    }])