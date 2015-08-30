angular.module('starter')
.config(function($translateProvider) {
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
})