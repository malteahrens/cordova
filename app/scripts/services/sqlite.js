angular.module('starter')
    .factory('Sqlite', function($cordovaSQLite, $window, Debug, $cordovaSQLite) {
        var db1;

        openDb = function() {
            if($window.cordova) {
                Debug.trace("open database with sqlite plugin");
                db1 = $cordovaSQLite.openDB("myapp.db");
            } else {
                Debug.trace("open database with browser");
                db1 = window.openDatabase("myapp.db", "1.0", "My app", -1);
            }
        };

        writeLocation = function(data) {
            console.log(data[1]);
            var d = new Date();
            var data = ['location', 1, data[0], data[1], 1, 2.0, d.getTime()];
            var query = 'INSERT INTO location (bssid, level, lat, lon, altitude, accuracy, time) VALUES (?,?,?,?,?,?,?)';
            $cordovaSQLite.execute(db1, query, data);
            Debug.trace("would write location to database")
        }

        initDb = function() {

            createNetwork = 'CREATE TABLE `network` ( \
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

            createLocation = 'CREATE TABLE `location` (  \
	                             `_id`	integer PRIMARY KEY AUTOINCREMENT,  \
	                             `bssid`	text NOT NULL, \
	                             `level`	integer NOT NULL, \
	                             `lat`	double NOT NULL, \
	                             `lon`	double NOT NULL, \
	                             `altitude`	double NOT NULL, \
	                             `accuracy`	float NOT NULL, \
	                             `time`	long NOT NULL );'

            $cordovaSQLite.execute(db1, 'DROP TABLE IF EXISTS location');
            $cordovaSQLite.execute(db1, 'DROP TABLE IF EXISTS network');
            $cordovaSQLite.execute(db1, createLocation);
            $cordovaSQLite.execute(db1, createNetwork);
        }

        var getResults = function() {
            var results = [];
            var query = 'SELECT * FROM location';
            $cordovaSQLite.execute(db1, query).then(function(res) {
                if(res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        console.log("Row "+i+": "+res.rows.item(i).lat);
                        results.push(res.rows.item(i));
                    }

                } else {
                    console.log("No results found");
                }
            }, function (err) {
                console.error(JSON.stringify(err));
            });

            return results;
        }

        return {
            initDb: initDb,
            openDb: openDb,
            getResults: getResults,
            writeLocation: writeLocation
        }
    });