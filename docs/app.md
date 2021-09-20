# api session token

```sh
adb root
adb shell "cat /data/data/com.moshbit.studo/shared_prefs/Preferences.xml" | grep -oP '"102">\K\w+'
```

Source: `com.moshbit.studo.app.Settings: getStudoSessionToken()`

# installationId

```sh
adb root
adb shell "cat /data/data/com.moshbit.studo/shared_prefs/Preferences.xml" | grep -oP '"110">\K\w+'
```
