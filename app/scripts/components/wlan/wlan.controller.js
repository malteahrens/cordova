angular.module('starter')
    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        }

        $scope.$on('$ionicView.enter', function (e) {
            WifiWizard.getScanResults(function (wifis) {
                $scope.chats = wifis;
            });
        });
    });