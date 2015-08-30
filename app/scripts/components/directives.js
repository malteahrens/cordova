angular.module("starter")
.directive("includeSettings", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load settings.html");
            scope.url = "scripts/components/setting/setting.hmtl";
        }
    }
})
.directive("includeLayers", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load layers.html");
            scope.url = "scripts/components/layer/layers.hmtl";
        }
    }
})
.directive("includeDebug", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load debug.html");
            scope.url = "scripts/components/debug/debug.hmtl";
        }
    }
})
.directive("includeWlan", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            console.log("load wlan.html");
            scope.url = "scripts/components/wlan/wlan.hmtl";
        }
    }
})