angular.module('starter.controllers', [])
.controller('ExperimentsCtrl', function ($scope, Sqlite, Layers) {
        $scope.results = [];
        $scope.resultsCount = 0;
        $scope.geojsonRecords = [];

        $scope.getResults = function() {
            $scope.results = Sqlite.getLogResults().then(function(results){
                $scope.results = results;
                Layers.gpsTrace(results);
                $scope.resultsCount = $scope.results.length;
            });
        }

        $scope.saveAsGeojson = function() {
            Sqlite.initGeoDb();
        }

        $scope.saveGeoJson = function() {
            var geojson = Layers.getData();
            Sqlite.saveGeoJson(geojson);
        }

        $scope.getGeoJson = function() {
            console.log("get geojson");
            Sqlite.getGeoJson().then(function (res) {
                $scope.geojsonRecords = res;
                $scope.resultsCount = res.length;
            }, function (err) {
                console.log(err);
            });
        };

        $scope.showGeojson = function(item) {
            var jsonString = unescape(item.json);
            var geojson = JSON.parse(jsonString);
            Layers.setLayerData('gpsStorage', geojson);
        }
})