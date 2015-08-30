angular.module('starter.controllers', [])
    .controller('LayersCtrl', function ($scope, Sqlite, Layers, GeoOperations, Debug, $stateParams, $state) {
        $scope.resultsCount = 0;
        $scope.geojsonRecords = [];

        $scope.initGeoDb = function() {
            Sqlite.initGeoDb();
            $scope.getGeoJson();
        }

        $scope.saveGeoJson = function() {
            var geojson = Layers.getData();
            Sqlite.saveGeoJson(geojson);
            var lineLength = GeoOperations.lineLength(geojson);
            $scope.getGeoJson();
        }

        $scope.getGeoJson = function(timeStamp) {
            Sqlite.getGeoJson(timeStamp).then(function (res) {
                $scope.geojsonRecords = res;
                $scope.resultsCount = res.length;
            }, function (err) {
                console.log(err);
            });
        };

        if($scope.title != $stateParams.layerId) {
            $scope.title = $stateParams.layerId;
            $scope.getGeoJson();
        }

        if($stateParams.layerId != undefined) {
            $scope.timeStamp = $stateParams.layerId;
            $scope.getGeoJson($scope.timeStamp);
        }

        $scope.showGeojson = function(json) {
            var jsonString = unescape(json);
            var geojson = JSON.parse(jsonString);
            Layers.setLayerData('gpsStorage', geojson);
        }

        $scope.showOnMap = function(json) {
            console.log("show on map");
            $state.go('tab.map');
            $scope.showGeojson(json);
        }

        $scope.length = function(geojson) {
            return geojson.time;
        }
    })