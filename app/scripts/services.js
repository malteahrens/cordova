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
    this_ = this
    this_.watchId = 333;
    var startWatch = function(onSuccess, onError, options){
        var q = $q.defer();
        this_.watchId = navigator.geolocation.watchPosition(function (position) {
            onSuccess(position)
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

    return {
        startWatch: startWatch,
        stopWatch: stopWatch
    }
}])

.factory('Settings', function(Debug) {
    var map = {
        activateGps: true,
        followGps: true,
        bearing: 0
    };

    var check = function(setting, func) {
        if(setting in map) {
            return map[setting];
        } else {
            return false;
        }
    }

    var save = function(map) {
        if(map.bearing === 0) {
            map.bearing = 1
        };
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
        map: map,
        save: save,
        load: load,
        check: check
    }
})

.factory('Debug', function() {
    var log=[];

    var trace=function(text, category, source){
        if(typeof text === 'object') {
            text = JSON.stringify(text, null, 2);
        }
        log.push({
            text: text,
            time: Date.now(),
            category: category,
            source: source
        })
        console.log(text);
    }


    var all = function() {
        return log;
    }

    return {
        trace: trace,
        all: all
    }
});