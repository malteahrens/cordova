angular.module('starter')
.factory('Geo', ['$q', 'Settings', 'Debug', '$cordovaBackgroundGeolocation', function($q, Settings, Debug, $cordovaBackgroundGeolocation){
    this_ = this
    this_.watchId = 333;
    var startWatch = function(onSuccess, onError, options){
        var q = $q.defer();
        this_.watchId = navigator.geolocation.watchPosition(function (position) {
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

    var startGps = function() {
        if(this.options !== undefined) {
            startWatch(this.onSuccess, this.onError, this.options);
            Debug.trace("started gps, configuration okay")
        } else {
            Debug.trace("couldn't start gps");
        }

    }

    var stopGps = function() {
        stopWatch();
    }

    var onSuccess;
    var onError;
    var options;
    var configure = function(onSuccess, onError, options) {
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.options = options;
    }



    return {
        startBackgroundGeoloc: startBackgroundGeoloc,
        stopBackgroundGeoloc: stopBackgroundGeoloc,
        startGps: startGps,
        stopGps: stopGps,
        configure: configure
    }
}])