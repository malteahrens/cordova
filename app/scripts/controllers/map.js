angular.module('starter')
    .controller('MapCtrl', function ($rootScope, $scope, $window, $timeout, Settings, Debug, Geo, GeoOperations, Sqlite, Layers) {
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
        $scope.statusLed = "yellow";

        $scope.statusToggle = function() {
            if($scope.statusLed === "yellow") {
                $scope.statusLed = "red";
            } else {
                $scope.statusLed = "yellow";
            }
            $scope.$apply();
        }

        var layerDataChange = {
            notify: function(layerId, data) {
                $scope.setLineData(layerId, data);
                var bbox = GeoOperations.getBounds(data);
                Debug.trace(bbox);
            },
            watch: "gpsStorage"
        }
        Layers.observer(layerDataChange);

        map.on('load', function(e) {
            Debug.trace("Map loaded");
            //var mapCanvasContainer = map.getCanvasContainer();
            //console.log(mapCanvasContainer);
            $scope.addGeojsonLayer({'name':'locationAccuracy'});
            $scope.addGeojsonLayer({'name':'locationHeading'});
            $scope.addGeojsonLayer({'name':'location'});
            $scope.addGeojsonLayer({'name':'gpsTrace'});
            $scope.addGeojsonLayer({'name':'gpsStorage'});
        });

        // access the device compass sensor
        if (window.DeviceOrientationEvent) {
            var oldValue = 0;
            var blocked = false;
            var rotateOptions = {
                duration: 1000
            };
            $window.addEventListener('deviceorientation', function(event) {
                if(Settings.map.rotate && !blocked) {
                    blocked = true;
                    // only update if the change is greater than 5 degrees
                    if(Math.abs(event.alpha-oldValue) > 10) {
                        map.rotateTo(event.alpha*(-1), rotateOptions);
                        oldValue = event.alpha
                    }
                    // after 2000ns allow to rotate the map again
                    $timeout(function() {blocked=false}, 2000);
                }
            }, false);
        } else {
            alert("no device orientation supported...");
        }

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

        $scope.setLineData = function(layerId, data) {
            //Debug.trace("Updated data: "+layerId);
            var layer = map.getSource(layerId);
            if(data !== undefined && layer !== undefined) {
                layer.setData(data);
            } else {
                console.log("couldn't draw gpsTrace, data is empty");
            }
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

                    // proj4js only supports simple point coordinates
                    //var reprojected = proj4('EPSG:4326','EPSG:3857',buffered);

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

            var zoomLevel = GeoOperations.speedToZoom(position.coords.speed);
            if(Settings.map.navigationMode) {
                map.easeTo({
                    center: location1,
                    zoom: zoomLevel,
                    duration: 0,
                    pitch: Settings.map.bearing
                });
            }
            else {
                if(Settings.map.followGps) {
                    map.easeTo({ center: location1, duration: 0 });
                }

                if(Settings.map.automaticZoom) {
                    console.log("speed: "+position.coords.speed+", zoomLevel: "+zoomLevel);
                    map.zoomTo(zoomLevel);
                }
            }


            if(Settings.map.recordGps) {
                var data = [position.coords.latitude, position.coords.longitude]
                Sqlite.writeLocation(data);
            }

            $scope.statusToggle();
            Layers.pushData([position.coords.longitude, position.coords.latitude]);
            $scope.setLineData('gpsTrace', Layers.getData());
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
        Geo.configure(onSuccess, onError, options);

        var fullscreenCb = function() {
            console.log("got fullscreen ready event");
            $timeout(function() {
                map.resize();
                map.render();
                var elem = map.getCanvas();
                console.log(elem);
                console.log("resize called");
            }, 3000);

        }
        document.addEventListener('webkitfullscreenchange',fullscreenCb);
        $scope.fullscreen = function() {
            // full-screen available?
            var elem = map.getCanvas();
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        }

        $scope.$on('$ionicView.enter', function () {
            if (!Settings.map.rotate) {
                map.rotateTo(0);
            }
            if (Settings.map.bearing) {
                map.setPitch(Settings.map.bearing);
                map.resize();

            }
        });
    })