angular.module('starter.controllers', [])

.controller('DashCtrl', function($rootScope, $scope, Settings, Geo) {
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

        var options = {maximumAge: 0, timeout: 100000, enableHighAccuracy:true};
        function onSuccess(position) {
            var location1 = [position.coords.latitude, position.coords.longitude];
            var location2 = [position.coords.longitude, position.coords.latitude];
            map.easeTo({ center: location1, duration: 0 });
        }

        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        $scope.$on('$ionicView.enter', function() {
            if(Settings.map.gps) {
                Geo.getLocation(onSuccess, onError, options);
                console.log("gps is enabled");
            }
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
  //
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }

    $scope.$on('$ionicView.enter', function(e) {
        WifiWizard.getScanResults(function(wifis) {
            $scope.chats=wifis;
        });
    });

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($rootScope, $scope, Settings) {
  $scope.toggleGpsTracking = function() {
      $scope.settings.enableGpsTracking = Settings.toggleGps();
  };

  $scope.$watch('enableGpsTracking', function (newVal, oldVal) {
    console.log("GPS set to: "+newVal);
  });

    $scope.settings = {
        enableGpsTracking: Settings.map.gps
    };
});
