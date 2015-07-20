angular.module('starter')
.factory('Settings', function(Debug) {
    var observerCallbacks = [];

    //register an observer
    var registerObserverCallback = function(callback){
        console.log("notify observer")
        observerCallbacks.push(callback);
    };

    var notifyObservers = function(){
        angular.forEach(observerCallbacks, function(callback){
            callback();
        });
    };

    var map = {
        activateGps: true,
        followGps: true,
        rotate: true,
        bearing: 0,
        server: false
    };

    var check = function(setting, func) {
        if(setting in map) {
            return map[setting];
        } else {
            return false;
        }
    }

    var save = function(map) {
        this.map = map;
        window.localStorage['settings'] = JSON.stringify(map);
        console.log("save config...");
        Debug.trace(map);
        notifyObservers();
    };

    // will be triggered when $ionicPlatform.ready in app.js
    var load = function() {
        try {
            this.map = JSON.parse(window.localStorage['settings'] || map);
        } catch(e) {
            Debug.trace("error loading the config from localStorage. Will fall back to default settings.");
            this.map = map;
        }
    };

    return {
        map: map,
        save: save,
        load: load,
        check: check,
        observer: registerObserverCallback
    }
})