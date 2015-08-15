angular.module('starter')
.factory('Geo', ['$q', 'Settings', 'Debug', '$cordovaBackgroundGeolocation', function($q, Settings, Debug, $cordovaBackgroundGeolocation){
    this_ = this
    this_.watchId = 333;
    var startWatch = function(onSuccess, onError, options){
        var q = $q.defer();
        this_.watchId = navigator.geolocation.watchPosition(function (position) {
            Debug.trace("got gps position");
            onSuccess(position);
            q.resolve();
        }, function (error) {
            q.reject(error)
        }, options);
        return q.promise;
    }
    var stopWatch = function() {
        console.log(this_.watchId);
        if (this_.watchId) {
            navigator.geolocation.clearWatch(this_.watchId);
            console.log("clear watch");
        }
    }
    var startBackgroundGeoloc = function() {
        Debug.trace("start gps")
        var options = {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 10,
            activityType: 'Other',
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
        };
        $cordovaBackgroundGeolocation.configure(options)
            .then(
            null, // Background never resolves
            function (err) { // error callback
                console.log(err);
            },
            function (location) { // notify callback
                console.log(location);
            });

        var onSuccess = function(location) {
            console.log("got geolocation"+location);
        }
        var onError = function(err) {
            console.log("error getting geolocation"+err)
        }
        $cordovaBackgroundGeolocation.start(onSuccess, onError);
    }

    var stopBackgroundGeoloc = function() {
        Debug.trace("stop gps")
        $cordovaBackgroundGeolocation.stop();
    }

    return {
        startWatch: startWatch,
        stopWatch: stopWatch,
        startBackgroundGeoloc: startBackgroundGeoloc,
        stopBackgroundGeoloc: stopBackgroundGeoloc
    }
}])