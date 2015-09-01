angular.module('starter')
.service('IonicServ', function($ionicPlatform) {
    this.fullscreen = function() {
        $ionicPlatform.fullScreen(false, true);
    }
})
