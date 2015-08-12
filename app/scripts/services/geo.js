angular.module('starter')
.factory('Geo', ['$q', 'Settings', 'Debug', function($q, Settings, Debug){
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
        console.log("Heeereee");
        console.log(this_.watchId);
        if (this_.watchId) {
            navigator.geolocation.clearWatch(this_.watchId);
            console.log("clear watch");
        }
    }

    return {
        startWatch: startWatch,
        stopWatch: stopWatch
    }
}])