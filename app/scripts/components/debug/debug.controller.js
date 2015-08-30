angular.module('starter')
    .controller('DebugCtrl', function ($scope, Debug) {
        $scope.log = Debug.all();
    });