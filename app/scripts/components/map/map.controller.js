angular.module('starter')
    .controller('MapCtrl', function ($rootScope, $scope, $window, $timeout, Settings, Debug, Geo, GeoOperations, Sqlite, LayerFact, $ionicScrollDelegate, MapServ) {
        MapServ.initMap()

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
                console.log(bbox);
                map.fitBounds(bbox);
            },
            watch: "gpsStorage"
        }
        LayerFact.observer(layerDataChange);



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
                        MapServ.rotate(event.alpha*(-1), rotateOptions);
                        oldValue = event.alpha
                    }
                    // after 2000ns allow to rotate the map again
                    $timeout(function() {blocked=false}, 2000);
                }
            }, false);
        } else {
            alert("no device orientation supported...");
        }

        $scope.setLineData = function(layerId, data) {
            Debug.trace("Updated data: "+layerId);
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
            LayerFact.pushData([position.coords.longitude, position.coords.latitude]);
            $scope.setLineData('gpsTrace', LayerFact.getData());
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
            $ionicScrollDelegate.resize();
        }

        $scope.$on('$ionicView.enter', function () {
            MapServ.rotate(0);
            MapServ.setPitch();
        });
    })