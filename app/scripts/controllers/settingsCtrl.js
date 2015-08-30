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
            navigationMode: Settings.map.navigationMode
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