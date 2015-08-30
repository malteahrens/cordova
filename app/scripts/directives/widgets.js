angular.module("starter").directive("toggleInclude", function() {
    return {
        restrict: "E",
        templateUrl: "/templates/widgets/toggle.html"
    }
})

.directive("inputInclude", function() {
    return {
        restrict: "E",
        templateUrl: "/templates/widgets/input.html"
    }
})