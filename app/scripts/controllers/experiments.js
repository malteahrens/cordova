angular.module('starter.controllers', [])
.controller('ExperimentsCtrl', function ($scope, Sqlite, Layers, GeoOperations, Debug) {
        $scope.results = [];
        $scope.resultsCount = 0;
        $scope.geojsonRecords = [];

        $scope.saveAsGeojson = function() {
            Sqlite.initGeoDb();
        }

        $scope.saveGeoJson = function() {
            var geojson = Layers.getData();
            Sqlite.saveGeoJson(geojson);
            var lineLength = GeoOperations.lineLength(geojson);
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