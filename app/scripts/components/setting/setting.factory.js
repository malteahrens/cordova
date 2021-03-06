angular.module('starter')
    .factory('Settings', function(Debug) {

        var map = {
            activateGps: true,
            recordGps: true,
            followGps: true,
            rotate: false,
            bearing: 0,
            server: false,
            automaticZoom: false,
            navigationMode: false,
            mapStyles: {
                satellite: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles//satellite-v8.json',
                hybrid: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles/satellite-hybrid-v8.json',
                bright: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles//bright-v8.json',
                streets: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles//streets-v8.json',
                dark: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles/dark-v8.json',
                emerald: 'https://raw.githubusercontent.com/mapbox/mapbox-gl-styles/master/styles/emerald-v8.json'
            }
        };

        var observerCallbacks = [];
        //register an observer
        var registerObserverCallback = function(callback) {
            console.log("added observer: "+callback.watchSetting)
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