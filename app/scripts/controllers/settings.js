angular.module('starter')
.controller('SettingsCtrl', function ($rootScope, $scope, Settings) {
    $scope.settings = {
        map: {
            activateGps: Settings.map.activateGps,
            followGps: Settings.map.followGps,
            bearing: Settings.map.bearing,
            server: Settings.map.server
        }
    };

    $scope.$watch('settings.map.activateGps', function (newVal, oldVal) {
        if(oldVal !== newVal) {
            console.log("activateGps set to: " + newVal);
            $scope.settings.map.activateGps = newVal;
            Settings.save($scope.settings.map);
        }
    });

    $scope.$watch('settings.map.followGps', function (newVal, oldVal) {
        if(oldVal !== newVal) {
            console.log("followGps set to: " + newVal);
            $scope.settings.map.followGps = newVal;
            Settings.save($scope.settings.map);
        }
    });

    $scope.$watch('settings.map.server', function (newVal, oldVal) {
        if(oldVal !== newVal) {
            console.log("server set to: " + newVal);
            $scope.settings.map.server = newVal;
            Settings.save($scope.settings.map);
        }
    });

    console.log(Settings.map.bearing)

    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e) {
        Settings.save($scope.settings.map)
        Debug.trace(JSON.stringify($scope.settings));
    }
})