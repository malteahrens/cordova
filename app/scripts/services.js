angular.module('starter.services', [])

.factory('Chats', function(Debug) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [
      {   "level": 10, // raw RSSI value
          "SSID": 'Wlan bli', // SSID as string, with escaped double quotes: "\"ssid name\""
          "BSSID": "1234" // MAC address of WiFi router as string
      },
      {   "level": 20, // raw RSSI value
          "SSID": "Wlan bla", // SSID as string, with escaped double quotes: "\"ssid name\""
          "BSSID": "2345" // MAC address of WiFi router as string
      },
      {   "level": 30, // raw RSSI value
          "SSID": "Wlan blubb", // SSID as string, with escaped double quotes: "\"ssid name\""
          "BSSID": "3456" // MAC address of WiFi router as string
      }
  ];

  Debug.trace("Chats");

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Geo', ['$q', function($q){
    var watchPosition = function(options) {
        var q = $q.defer();
        var watchId;
        var start = function(success, error) {
            watchId = navigator.geolocation.watchPosition(success, error);
            q.resolve("here");
        }
        var stop = function() {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        }
        return q.promise;
    };

    var getLocation = function(onSuccess, onError, options){
        var q = $q.defer();
        navigator.geolocation.watchPosition(function (position) {
            onSuccess(position)
            q.resolve();
        }, function (error) {
            q.reject(error)
        }, options);
        return q.promise;
    };

    return {
        getLocation: getLocation,
        watchPosition: watchPosition
    }
}])

.factory('Settings', function(Debug) {
    var map = {
        gps: true,
        bearing: 60
    };

    var toggleGps = function() {
        this.map.gps = !this.map.gps;
        save(this.map);
        return this.map.gps;
    };

    var save = function(map) {
        this.map = map;
        window.localStorage['settings'] = JSON.stringify(map);
        console.log("save config...");
        Debug.trace(map);
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
        toggleGps: toggleGps,
        map: map,
        save: save,
        load: load
    }
})

.factory('Debug', function() {
    var log=[];
    var trace=function(object){
        console.log("add to log object...");
        log.push({
            text: object,
            time: Date.now()
        })
    }

    var all = function() {
        return log;
    }

    return {
        trace: trace,
        all: all
    }
});