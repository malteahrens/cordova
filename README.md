# Development
## Overview
The project was bootstrapped with [ionic-angular-cordova-seed]
(https://github.com/driftyco/ionic-angular-cordova-seed) yeoman seed. 

The following are some ideas about cool stuff for the future...

## Useful development hints
grunt serve
ionic serve --lab --consolelogs 

## Switch API version
Change:
```xml
<preference name="android-maxSdkVersion" value="19" />
<preference name="android-targetSdkVersion" value="19" />
```
To:
```xml
<preference name="android-maxSdkVersion" value="22" />
<preference name="android-targetSdkVersion" value="22" />
```
in
```
/hooks/after_prepare/update_platform_config.js
```

# Own Map
Currently the map consumes data provided by Mapbox. It would be nice to have an own tile source as described at http://trevorpowell.com/2015/02/20/mapbox-gl-js-with-offline-vector-tiles-on-cordova/. 