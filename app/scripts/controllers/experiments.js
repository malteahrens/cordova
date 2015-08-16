angular.module('starter.controllers', [])
.controller('ExperimentsCtrl', function ($scope, Sqlite, Layers) {
        $scope.results = [];
        $scope.resultsCount = 0;

        $scope.getResults = function() {
            $scope.results = Sqlite.getResults().then(function(results){
                $scope.results = results;
                Layers.gpsTrace(results);
                $scope.resultsCount = $scope.results.length;
            });
        }
})