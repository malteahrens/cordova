angular.module('starter.controllers', [])
.controller('ExperimentsCtrl', function ($scope, $cordovaSQLite, $window) {
        var db1;
        $scope.results = [];

        $scope.$watch('results', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                console.log("results changed");
            }
        });

        if($window.cordova) {
            console.log("open database with sqlite plugin");
            db1 = $cordovaSQLite.openDB("myapp.db");
        } else {
            console.log("open database with browser");
            db1 = $window.openDatabase("myapp.db", "1.0", "My app", -1);
        }

        var getResults = function() {
            var query = 'SELECT * FROM DEMO';
            $cordovaSQLite.execute(db1, query).then(function(res) {
                if(res.rows.length > 0) {

                    for (var i = 0; i < res.rows.length; i++) {
                        console.log("Row "+i+": "+res.rows.item(i).data);
                        $scope.results[i] = res.rows.item(i);
                    }

                } else {
                    console.log("No results found");
                }
            }, function (err) {
                console.error(err);
            });

        }

        $scope.initDb = function() {
            $cordovaSQLite.execute(db1, 'DROP TABLE IF EXISTS DEMO');
            $cordovaSQLite.execute(db1, 'CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
            $cordovaSQLite.execute(db1, 'INSERT INTO DEMO (id, data) VALUES (1, "First row")');
            $cordovaSQLite.execute(db1, 'INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
            getResults();
        }

        if(!$scope.isDbPopulated) {
            $scope.initDb();
        }

        $scope.clearDb = function() {
            console.log("clear db");
            $scope.initDb();
        }

        $scope.insertRow = function() {
            console.log("insert row");
            $cordovaSQLite.execute(db1, 'INSERT INTO DEMO (id, data) VALUES (3, "Third row")');
            getResults();
        }
})