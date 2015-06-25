angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiLS1tYWx0ZWFocmVucyIsImEiOiJGU21QX2VVIn0.GVZ36UsnwYc_JfiQ61lz7Q';
        var map = new mapboxgl.Map({
            container: 'map',
            zoom: 12.5,
            center: [48.14882451158226, 11.451873779296875],
            style: 'https://www.mapbox.com/mapbox-gl-styles/styles/bright-v7.json',
            minZoom: 9,
            maxZoom: 20,
            interactive: true
        });


// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat  = position.coords.latitude
                var long = position.coords.longitude
            }, function(err) {
                // error
            });


        var watchOptions = {
            frequency : 1000,
            timeout : 3000,
            enableHighAccuracy: false // may cause errors if true
        };

        var watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(
            null,
            function(err) {
                // error
            },
            function(position) {
                var lat  = position.coords.latitude
                var long = position.coords.longitude
            });
})

.controller('MapController', function($scope, $ionicLoading) {

})

.controller('WifiController', function($scope, $ionicLoading) {
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
