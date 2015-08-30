angular.module("starter")
.directive("includeSettingComponent", function() {
    return {
        restrict: "E",
        template: '<div ng-include="url"></div>',
        link: function(scope, element, attrs){
            var typeOf = (typeof attrs.type);
            var integer = parseInt(attrs.type, 10);
            var template = '';

            if (!isNaN(integer)) {
                typeOf = 'integer';
                template = 'input';
            } else {
                typeOf = 'boolean';
                template = 'toggle';
            }

            scope.url = "scripts/components/setting/templates/"+ template + ".html";
        }
    }
})