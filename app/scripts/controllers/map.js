angular.module('starter')
.controller('MapCtrl', function ($rootScope, $scope, Settings, Debug, Geo) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiLS1tYWx0ZWFocmVucyIsImEiOiJGU21QX2VVIn0.GVZ36UsnwYc_JfiQ61lz7Q';
    var map = new mapboxgl.Map({
        container: 'map',
        zoom: 12,
        center: [48.14882451158226, 11.451873779296875],
        style: 'https://www.mapbox.com/mapbox-gl-styles/styles/bright-v7.json',
        minZoom: 9,
        maxZoom: 20,
        interactive: true
    });
    map.addControl(new mapboxgl.Navigation());
    map.setPitch(Settings.map.bearing);

    map.on('load', function(e) {
        Debug.trace("Map loaded");
        $scope.addGeojsonLayer({'name':'locationAccuracy'});
        $scope.addGeojsonLayer({'name':'locationHeading'});
        $scope.addGeojsonLayer({'name':'location'});
    });

    $scope.addGeojsonLayer = function(layer, visibility) {
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
            }
        }
        data = [0, 0]
        map.addSource(layer.name, {
            "type": "geojson",
            "data": data
        });
        map.addLayer({
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

    $scope.setBufferData = function(layerId, data, radius) {
        try {
            var layer = map.getSource(layerId);
            if (layer !== undefined) {
                var point = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": data
                    }
                }

                var buffered = turf.buffer(point, radius, 'kilometers')
                layer.setData(buffered);
            } else {
                console.log("Couldn't update data: layer not found");
            }
        } catch(err) {
            Debug.trace("Could not find layer")
        }
    };

    var options = {maximumAge: 0, timeout: 100000, enableHighAccuracy: true}

    function onSuccess(position) {
        var location1 = [position.coords.latitude, position.coords.longitude];
        var location2 = [position.coords.longitude, position.coords.latitude];
        map.easeTo({ center: location1, duration: 0 });

        var point = {
            "type": "Feature",
            "properties": {
                "marker-color": "#0f0"
            },
            "geometry": {
                "type": "Point",
                "coordinates": location2
            }
        };

        var radius = position.coords.accuracy * 0.001
        $scope.setBufferData("locationAccuracy", location2, radius);
    };

    function onError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.");
                break;
        }
    };

    $scope.$on('$ionicView.enter', function () {
        if (Settings.map.activateGps) {
            Geo.startWatch(onSuccess, onError, options);
            Debug.trace("gps is enabled");
        } else {
            Geo.stopWatch();
            Debug.trace("gps is disable");
        }
        if (Settings.map.followGps) {
            Debug.trace("followGps is enabled");
        } else {
            Debug.trace("followGps is disable");
        }
        if (Settings.map.bearing) {
            Debug.trace("setting bearing to: " + Settings.map.bearing);
            map.setPitch(Settings.map.bearing);
            map.resize();
        }
    });
})