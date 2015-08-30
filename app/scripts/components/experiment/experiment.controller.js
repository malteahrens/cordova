angular.module('starter')
.controller('ExperimentsCtrl', function ($scope, Debug) {
    $scope.save = function() {
        console.log("save editor content");
    }
});