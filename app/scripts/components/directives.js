// transclusion
angular.module("starter")
.directive("includeSettings", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load settings.html");
            scope.url = "scripts/components/setting/setting.html";
        }
    }
})
.directive("includeLayers", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load layers.html");
            scope.url = "scripts/components/layer/layers.html";
        }
    }
})
.directive("includeDebug", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load debug.html");
            scope.url = "scripts/components/debug/debug.html";
        }
    }
})
.directive("includeWlan", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load wlan.html");
            scope.url = "scripts/components/wlan/wlan.html";
        }
    }
})
.directive("includeExperiments", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load experiment.html");
            scope.url = "scripts/components/experiment/experiment.html";
        }
    }
})
.directive("includeMapMenu", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load map.html");
            scope.url = "scripts/components/map/map.html";
        }
    }
})