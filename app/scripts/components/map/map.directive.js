angular.module("starter")
.directive("toggleWidget", function() {
    return {
        restrict: "E",
        replace: true,
        template: "<a ng-click='toggleWidget()' id='legend'>Legend</a>"
    }
)