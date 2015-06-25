# Switch API version
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