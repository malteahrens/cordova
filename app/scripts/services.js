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
})

.factory('Server', function() {
    console.log("server loader");
    var httpd = null;

    function init(corHttpd) {
        httpd = corHttpd;
    }

    function updateStatus() {
        //document.getElementById('location').innerHTML = "document.location.href: " + document.location.href;
        console.log("document.location.href: " + document.location.href);
        if( httpd ) {
            /* use this function to get status of httpd
             * if server is up, it will return http://<server's ip>:port/
             * if server is down, it will return empty string ""
             */
            httpd.getURL(function(url){
                if(url.length > 0) {
                    //document.getElementById('url').innerHTML = "server is up: <a href='" + url + "' target='_blank'>" + url + "</a>";
                    console.log("server is up: <a href='" + url);
                } else {
                    //document.getElementById('url').innerHTML = "server is down.";
                    console.log("server is down.");
                }
            });
            // call this function to retrieve the local path of the www root dir
            httpd.getLocalPath(function(path){
                //document.getElementById('localpath').innerHTML = "<br/>localPath: " + path;
                console.log("localPath: " + path);
            });
        } else {
            alert('CorHttpd plugin not available/ready.');
        }
    }
    function startServer( wwwroot ) {
        if ( httpd ) {
            // before start, check whether its up or not
            httpd.getURL(function(url){
                if(url.length > 0) {
                    //document.getElementById('url').innerHTML = "server is up: <a href='" + url + "' target='_blank'>" + url + "</a>";
                    console.log("server is up: " + url);
                } else {
                    /* wwwroot is the root dir of web server, it can be absolute or relative path
                     * if a relative path is given, it will be relative to cordova assets/www/ in APK.
                     * "", by default, it will point to cordova assets/www/, it's good to use 'htdocs' for 'www/htdocs'
                     * if a absolute path is given, it will access file system.
                     * "/", set the root dir as the www root, it maybe a security issue, but very powerful to browse all dir
                     */
                    httpd.startServer({
                        'www_root' : wwwroot,
                        'port' : 8080,
                        'localhost_only' : false
                    }, function( url ){
                        // if server is up, it will return the url of http://<server ip>:port/
                        // the ip is the active network connection
                        // if no wifi or no cell, "127.0.0.1" will be returned.
                        //document.getElementById('url').innerHTML = "server is started: <a href='" + url + "' target='_blank'>" + url + "</a>";
                        console.log("server is started: "+url)
                    }, function( error ){
                        //document.getElementById('url').innerHTML = 'failed to start server: ' + error;
                        console.log('failed to start server: ' + error);
                    });
                }

            });
        } else {
            alert('CorHttpd plugin not available/ready.');
        }
    }
    function stopServer() {
        if ( httpd ) {
            // call this API to stop web server
            httpd.stopServer(function(){
                //document.getElementById('url').innerHTML = 'server is stopped.';
                console.log("server is stopped.");
            },function( error ){
                //document.getElementById('url').innerHTML = 'failed to stop server' + error;
                console.log('failed to stop server' + error)
            });
        } else {
            alert('CorHttpd plugin not available/ready.');
        }
    }

    return {
        updateStatus: updateStatus,
        startServer: startServer,
        stopServer: stopServer,
        init: init
    }
});