angular.module("starter")
.directive('markdownEditor', function() {
    return {
        scope: {

        },
        link: function(scope, elem, attrs) {
            console.log("markdownEditor directive");
            $(elem).markdown({
                savable:true,
            });
        }
    };
});