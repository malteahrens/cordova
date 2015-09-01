/**
 * The goal of the presentation controller is to define a simple model and listen for changes.
 * As soon as a settings changes, it will save the settings object to the model.
 * The UI is generated from the settings object. This is a flexible approach to reuse the settings controller.
 */

angular.module('starter')
    .controller('SettingsCtrl', function ($rootScope, $scope, $ionicScrollDelegate, Settings) {
        $scope.settings = {
            map: {
                activateGps: Settings.map.activateGps,
                recordGps: Settings.map.recordGps,
                followGps: Settings.map.followGps,
                rotate: Settings.map.rotate,
                bearing: Settings.map.bearing,
                server: Settings.map.server,
                automaticZoom: Settings.map.automaticZoom,
                navigationMode: Settings.map.navigationMode,
                styles: {
                    satellite: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles//satellite-v8.json',
                    hybrid: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles/satellite-hybrid-v8.json',
                    bright: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles//bright-v8.json',
                    streets: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles//streets-v8.json',
                    dark: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles/dark-v8.json',
                    emerald: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles/emerald-v8.json'
                },
                test: [
                    'mapbox.dark-v7',
                    'mapbox.light-v7',
                    'mapbox.emerald-v7',
                    'mapbox.streets-v7',
                    'mapbox.bright-v7',
                    'mapbox.empty-v7',
                    'mapbox.basic-v7',
                    'streets-v8',
                    'light-v8',
                    'dark-v8',
                    'bright-v8',
                    'basic-v8',
                    'empty-v8',
                    'satellite-v8',
                    'satellite-hybrid-v8',
                    'emerald-v8'
                ]
            },
            server: {
                server: Settings.map.server
            }
        };

        $scope.$watch('settings.map.activateGps', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                $scope.settings.map.activateGps = newVal;
                Settings.save($scope.settings.map);
            }
        });

        $scope.$watch('settings.map.recordGps', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                $scope.settings.map.recordGps = newVal;
                Settings.save($scope.settings.map);
            }
        });

        $scope.$watch('settings.map.followGps', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                $scope.settings.map.followGps = newVal;
                Settings.save($scope.settings.map);
            }
        });

        $scope.$watch('settings.map.server', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                $scope.settings.map.server = newVal;
                Settings.save($scope.settings.map);
            }
        });

        $scope.$watch('settings.map.rotate', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                $scope.settings.map.rotate = newVal;
                Settings.save($scope.settings.map);
            }
        });

        $scope.$watch('settings.map.automaticZoom', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                $scope.settings.map.automaticZoom = newVal;
                Settings.save($scope.settings.map);
            }
        });

        $scope.$watch('settings.map.navigationMode', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                $scope.settings.map.animationMode = newVal;
                Settings.save($scope.settings.map);
            }
        });

        window.addEventListener('native.keyboardhide', keyboardHideHandler);
        function keyboardHideHandler(e) {
            Settings.save($scope.settings.map);
        }

        $scope.keyName = function(group) {
            var keyName = Object.keys(group)[0]
            console.log(keyName);
        }

        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
            $ionicScrollDelegate.resize();
        };
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };
    })