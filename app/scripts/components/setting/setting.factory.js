angular.module('starter')
    .factory('Settings', function(Debug) {

        var map = {
            activateGps: true,
            recordGps: true,
            followGps: true,
            rotate: false,
            bearing: 90,
            server: false,
            automaticZoom: false,
            navigationMode: false
        };

        var observerCallbacks = [];
        //register an observer
        var registerObserverCallback = function(callback) {
            console.log("added observer")
            observerCallbacks.push(callback);
        };

        var notifyObservers = function(settingChanged, settings) {
            angular.forEach(observerCallbacks, function(callback){
                var watchSetting = callback.watchSetting;
                if(watchSetting != undefined && settingChanged === watchSetting) {
                    console.log("notify "+settingChanged+" observer, settings changed to "+settings[watchSetting]);
                    callback.notify(settings[watchSetting]);
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
                if(settings[setting] !== this.map[setting]) {
                    settingChanged = setting;
                    this.map[settingChanged] = settings[settingChanged];
                    console.log("Setting changed: "+settingChanged);
                }
            }
            window.localStorage['settings'] = JSON.stringify(map);
            notifyObservers(settingChanged, settings);
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