angular.module('starter')
    .factory('Sqlite', function($cordovaSQLite, $window, $q, Debug, $cordovaSQLite, Layers, GeoOperations) {

        var databases = {
            db1: null,
            geoDb: null
        }

        openDb = function() {
            if($window.cordova) {
                Debug.trace("open database with sqlite plugin");
                databases.db1 = $cordovaSQLite.openDB("myapp.db");
            } else {
                Debug.trace("open database with browser");
                databases.db1 = window.openDatabase("myapp.db", "1.0", "My app", -1);
            }
        };

        openGeoDb = function() {
            if($window.cordova) {
                Debug.trace("open geo database with sqlite plugin");
                databases.geoDb = $cordovaSQLite.openDB("geo.db");
            } else {
                Debug.trace("open geo database with browser");
                databases.geoDb = window.openDatabase("geo.db", "1.0", "My app", -1);
            }
        };

        writeLocation = function(data) {
            var d = new Date();
            var data = ['location', 1, data[0], data[1], 1, 2.0, d.getTime()];
            var query = 'INSERT INTO location (bssid, level, lat, lon, altitude, accuracy, time) VALUES (?,?,?,?,?,?,?)';
            $cordovaSQLite.execute(databases.db1, query, data);
        }

        initDb = function() {

            var createNetwork = 'CREATE TABLE `network` ( \
	                          `bssid`	text NOT NULL, \
	                          `ssid`	text NOT NULL, \
                              `frequency`	int NOT NULL, \
                              `capabilities`	text NOT NULL, \
                              `lasttime`	long NOT NULL, \
                              `lastlat`	double NOT NULL, \
                              `lastlon`	double NOT NULL, \
                              `type`	text NOT NULL DEFAULT \'W\', \
                              `bestlevel`	integer NOT NULL DEFAULT 0, \
                              `bestlat`	double NOT NULL DEFAULT 0, \
                              `bestlon`	double NOT NULL DEFAULT 0, \
                                          PRIMARY KEY(bssid) );'

            var createLocation = 'CREATE TABLE `location` (  \
	                             `_id`	integer PRIMARY KEY AUTOINCREMENT,  \
	                             `bssid`	text NOT NULL, \
	                             `level`	integer NOT NULL, \
	                             `lat`	double NOT NULL, \
	                             `lon`	double NOT NULL, \
	                             `altitude`	double NOT NULL, \
	                             `accuracy`	float NOT NULL, \
	                             `time`	long NOT NULL );'

            $cordovaSQLite.execute(databases.db1, 'DROP TABLE IF EXISTS location');
            $cordovaSQLite.execute(databases.db1, 'DROP TABLE IF EXISTS network');
            $cordovaSQLite.execute(databases.db1, createLocation);
            $cordovaSQLite.execute(databases.db1, createNetwork);
        }

        var getResults = function(db, query) {
            var results = [];
            var deferred = $q.defer();

            if(query === undefined) {
                console.log("please specify a query");
            }
            if(db === null) {
                console.log("database is not open");
            }


            $cordovaSQLite.execute(db, query).then(function(res) {
                if(res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        //console.log("Row "+i+": "+res.rows.item(i).lat);
                        results.push(res.rows.item(i));
                    }
                    deferred.resolve(results);
                } else {
                    deferred.reject("No results found");
                }
            }, function (err) {
                console.error(JSON.stringify(err));
            });

            return deferred.promise;
        }

        var initGeoDb = function() {
            console.log("init Geo database");
            var createLocation = 'CREATE TABLE `location` (  \
	                             `_id`	integer PRIMARY KEY AUTOINCREMENT,  \
	                             `json`	text NOT NULL, \
	                             `time`	long NOT NULL,\
	                             `length` double, \
                                 `description` text \
                                 );'

            $cordovaSQLite.execute(databases.geoDb, 'DROP TABLE IF EXISTS location');
            $cordovaSQLite.execute(databases.geoDb, createLocation);
        }

        var saveGeoJson = function(geojson) {
            // should not store if length is 0
            //console.log(geojson.geometry.coordinates.length);
            console.log("insert geojson")
            var jsonString = escape(JSON.stringify(geojson));
            // line length is in kilometers - calculate meters
            var lineLength = GeoOperations.lineLength(geojson)*1000;
            var lineLengthRounded = Number(lineLength.toFixed(1));
            console.log(lineLengthRounded);

            var d = new Date();
            var data = [d.getTime(), jsonString, lineLengthRounded];
            var query = 'INSERT INTO location (time, json, length) VALUES (?, ?, ?)';

            $cordovaSQLite.execute(databases.geoDb, query, data).then(function (res) {
                console.log("wrote geojson to db: ")
                console.log(res);
            }, function (err) {
                console.log(err);
            });
        }

        var getGeoJson = function(timeStamp) {
            var query = 'SELECT * FROM location';
            if(timeStamp != undefined) {
                var query = 'SELECT * FROM location WHERE time='+timeStamp+'';
            }

            var deferred = $q.defer();
            getResults(databases.geoDb, query).then(function(results) {
                deferred.resolve(results);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        return {
            initDb: initDb,
            openDb: openDb,
            openGeoDb: openGeoDb,
            writeLocation: writeLocation,
            initGeoDb: initGeoDb,
            getGeoJson: getGeoJson,
            saveGeoJson: saveGeoJson
        }
    });