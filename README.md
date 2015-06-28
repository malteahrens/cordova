# Development
## Overview
The project was bootstrapped with [ionic-angular-cordova-seed]
(https://github.com/driftyco/ionic-angular-cordova-seed) yeoman seed. 

## Useful development hints
grunt serve
ionic serve --lab

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

