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

        var onSuccess = function(position) {
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');
        };

// onError Callback receives a PositionError object
//
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        if (navigator.geolocation) {
            alert("geolocation should work");
        }

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
        function onSuccess(position) {
            var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                'Longitude: ' + position.coords.longitude     + '<br />' +
                '<hr />'      + element.innerHTML;
        }

// onError Callback receives a PositionError object
//
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

// Options: throw an error if no update is received every 30 seconds.
//
        var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
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
