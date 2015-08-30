angular.module('starter')
.filter('capitalize', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }
});