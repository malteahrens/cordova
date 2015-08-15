angular.module('starter')
.factory('Settings', function(Debug) {
    var observerCallbacks = [];
    var map = {
        activateGps: true,
        recordGps: true,
        followGps: true,
        rotate: true,
        bearing: 0,
        server: false
    };

    //register an observer
    var registerObserverCallback = function(callback) {
        console.log("added observer")
        observerCallbacks.push(callback);
    };

    var notifyObservers = function(settingChanged) {
        console.log(observerCallbacks.size);
        angular.forEach(observerCallbacks, function(callback){
            var watchSetting = callback.watchSetting;
            if(watchSetting != undefined && settingChanged === watchSetting) {
                console.log("notify "+settingChanged+" observer, settings changed to "+map[watchSetting]);
                callback.notify(map[watchSetting]);
            }
        });
    };

    var check = function(setting, func) {
        if(setting in map) {
            return map[setting];
        } else {
            return false;
        }
    }

    var save = function(settings) {
        var settingChanged = "";
        // find changed setting
        for (var setting in settings) {
            if(settings[setting] !== map[setting]) {
                settingChanged = setting;
                map[setting] = settings[setting];
            }
        }
        window.localStorage['settings'] = JSON.stringify(map);
        notifyObservers(settingChanged);
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