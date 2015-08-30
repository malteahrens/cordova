// angular.module is a global place for creating, registering and retrieving Angular modules
// bootstrap angular manually instead of ng-init in body tag
angular.element(document).ready(function() {
    angular.bootstrap(document, ['starter']);
});

angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'pascalprecht.translate'])

    .run(function($ionicPlatform, Settings, Server, Sqlite, Geo, $rootScope, $translate) {
        $ionicPlatform.ready(function() {
            // get locale - this needs the cordova globilization plugin to work
            if(typeof navigator.globalization !== "undefined") {
                navigator.globalization.getPreferredLanguage(function(language) {
                    $translate.use((language.value).split("-")[0]).then(function(data) {
                        console.log("the app is running on -> " + data + " <- phone");
                    }, function(error) {
                        console.log("ERROR -> " + error);
                    });
                }, null);
            } else {
                console.log("couldn't determine locale");
            }

            /** DEBUG ROUTES
            $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
            });
            $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams, error){
                console.log('$stateChangeError - fired when an error occurs during transition.');
                console.log(arguments);
            });
            $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
            });

            $rootScope.$on('$viewContentLoading',function(event, viewConfig){
               // runs on individual scopes, so putting it in "run" doesn't work.
               console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
             });
            $rootScope.$on('$viewContentLoaded',function(event){
                console.log('$viewContentLoaded - fired after dom rendered',event);
            });
            $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
                console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
                console.log(unfoundState, fromState, fromParams);
            });
            **/

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
            // load settings from localStorage
            Settings.load();

            // open database for storing gps
            Sqlite.openDb();
            Sqlite.openGeoDb();
            Sqlite.initDb();

            // serve assets via server
            var corHttpd = cordova.plugins.CorHttpd;
            Server.init(corHttpd);
            Server.startServer();

            var restartServer = {
                notify: function() {
                    Server.stopServer();
                    Server.startServer();
                },
                watchSetting: "server"
            }
            Settings.observer(restartServer);

            // GPS
            var settingsChange = {
                notify: function(setting) {
                    if (setting) {
                        Geo.startBackgroundGeoloc();
                        Geo.startGps();
                    } else {
                        Geo.stopBackgroundGeoloc();
                        Geo.stopGps();
                        console.log("got notification to stop gps background");
                    }
                },
                watchSetting: "activateGps"
            }
            Settings.observer(settingsChange);
            settingsChange.notify(Settings.map.activateGps);

            volumedownCallback = function() {
                console.log("Volume down pressed");
            }
            volumeupCallback = function() {
                console.log("Volume up pressed");
            }
            resumeCallback = function() {
                console.log("welcome back from resume")
            }
            backgroundCallback = function() {
                console.log("app is in background")
            }
            document.addEventListener('resume',resumeCallback);
            document.addEventListener("pause", backgroundCallback, false);

            document.addEventListener("volumedownbutton", volumedownCallback, false);
            document.addEventListener("volumeupbutton", volumeupCallback, false);
        });


    })

    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.map', {
                url: '/map',
                views: {
                    'tab-map': {
                        templateUrl: 'templates/tab-map.html',
                        controller: 'MapCtrl',
                        resolve: {
                            settings: function(Settings) {
                                return {map: true}
                            }
                        }
                    }
                }
            })

            .state('tab.layers', {
                url: '/layers',
                views: {
                    'tab-layers': {
                        templateUrl: 'templates/tab-layers.html',
                        controller: 'LayersCtrl',
                        resolve: {
                            settings: function(Settings) {
                                return {map: true}
                            }
                        }
                    }
                }
            })

            .state('layers-detail', {
                url: '/geojson/:layerId',
                templateUrl: 'scripts/components/layer/templates/geojson-detail.html',
                controller: 'LayersCtrl'
            })

            .state('tab.wlan', {
                url: '/wlan',
                views: {
                    'tab-wlan': {
                        templateUrl: 'templates/tab-wlan.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })

            .state('tab.settings', {
                url: '/settings',
                views: {
                    'tab-settings': {
                        templateUrl: 'templates/tab-settings.html',
                        controller: 'SettingsCtrl',
                        resolve: {
                            settings: function(Settings) {
                                return {map: true}
                            }
                        }
                    }
                }
            })

            .state('tab.experiments', {
                url: '/experiments',
                views: {
                    'tab-experiments': {
                        templateUrl: 'templates/tab-experiments.html',
                        controller: 'ExperimentsCtrl'
                    }
                }
            })

            .state('tab.debug', {
                url: '/debug',
                views: {
                    'tab-debug': {
                        templateUrl: 'templates/tab-debug.html',
                        controller: 'DebugCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/map');

        // for security: http://angular-translate.github.io/docs/#/guide/19_security
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.preferredLanguage('de');
        $translateProvider.translations('de', {
                map: "Karte",
                server: "Server",
                activateGps: "GPS aktivieren",
                automaticZoom: 'Automatischer Zoom',
                bearing: "Karte kippen",
                followGps: "Position folgen",
                navigationMode: "Animation Mode",
                recordGps: "Position aufnehmen",
                rotate: "Kartenrotation"
        });

        $translateProvider.translations('en', {
            activateGps: "Activate GPS",
        });
    });
