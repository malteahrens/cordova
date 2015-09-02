angular.module('starter')
    .controller('MapCtrl', function ($rootScope, $scope, $window, $timeout, Settings, Debug, GpsFactory, GeoOperations, Sqlite, $ionicScrollDelegate, MapServ, IonicServ) {
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

        // react on data changes...
        MapServ.addLayerDataObserver();

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

        var fullscreenCb = function() {
            console.log("got fullscreen ready event");
            $timeout(function() {
                MapServ.resize();
                MapServ.render();
                var elem = MapServ.getCanvas();
                console.log(elem);
                console.log("resize called");
            }, 3000);

        }
        document.addEventListener('webkitfullscreenchange',fullscreenCb);
        $scope.fullscreen = function() {
            // full-screen available?
            var elem = MapServ.getCanvas();
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


        $scope.toggleWidget = function(widgetName) {
            if(widgetName === 'fullscreen') {
                //IonicServ.fullscreen();
            }
        }

        $scope.$on('$ionicView.enter', function () {
            MapServ.rotate(0);
            MapServ.setPitch();
        });
    })