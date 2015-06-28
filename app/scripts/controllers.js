angular.module('starter.controllers', [])

.controller('MapCtrl', function($rootScope, $scope, Settings, Geo) {
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
        map.addControl(new mapboxgl.Navigation());
        map.setPitch(Settings.map.bearing);

        var options = {maximumAge: 0, timeout: 100000, enableHighAccuracy:true}
        function onSuccess(position) {
            var location1 = [position.coords.latitude, position.coords.longitude];
            var location2 = [position.coords.longitude, position.coords.latitude];
            map.easeTo({ center: location1, duration: 0 });
        };

        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        };

        $scope.$on('$ionicView.enter', function() {
            if(Settings.map.gps) {
                Geo.getLocation(onSuccess, onError, options);
                console.log("gps is enabled");
                console.log("bearing: "+Settings.map.bearing);
                map.setPitch(Settings.map.bearing);
            }
        });

    })

.controller('ExperimentsCtrl', function($scope, $ionicLoading) {
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

    console.log(Settings.map.bearing)
    $scope.settings = {
        map: {
            gps: Settings.map.gps,
            bearing: Settings.map.bearing
        }
    };


    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e){
        $scope.settings.mapBearing =  $scope.settings.mapBearing;
        Settings.save($scope.settings.map)
        console.log(JSON.stringify($scope.settings));
    }
})

.controller('DebugCtrl', function($scope, Debug) {
    $scope.log = Debug.all();
    Debug.trace("I'm now in debug view...");
});