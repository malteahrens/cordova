angular.module('starter')
    .factory('overpassAPI', function ($http) {
        var trigger = function () {
            console.log("trigger search");
            //overpassAPI.search('[bbox][out:json];way;out center;&bbox=' + map.getBounds().toBBoxString()).then(function(data) {

            //});
        }

        return {
            search: function (query) {
                return $http.get('http://overpass.osm.rambler.ru/cgi/interpreter?data=' + query);
            }
        }
    });
}