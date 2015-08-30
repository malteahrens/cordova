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