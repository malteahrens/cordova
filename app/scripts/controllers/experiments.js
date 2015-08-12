angular.module('starter.controllers', [])
.controller('ExperimentsCtrl', function ($scope, Sqlite) {
        $scope.$watch('results', function (newVal, oldVal) {
            if(oldVal !== newVal) {
                console.log("results changed");
            }
        });

        $scope.getResults = function() {
            $scope.results = Sqlite.getResults();
            $scope.resultsCount = $scope.results.length;
        }
})