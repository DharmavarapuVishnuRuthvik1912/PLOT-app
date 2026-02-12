# Build PLOT APK (Android)

## 1) First-time setup
- Install Android Studio (includes SDK + Gradle support).
- Open this folder: `android-plot`.
- Let Android Studio finish Gradle sync.

## 2) Sync latest web app into Android assets
Run in terminal:

```bash
cd /Users/ruthvik/Documents/codex/android-plot
chmod +x SYNC_WEB_ASSETS.sh
./SYNC_WEB_ASSETS.sh
```

## 3) Build debug APK
In Android Studio:
- `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`

APK output:
- `app/build/outputs/apk/debug/app-debug.apk`

## 4) Install on phone without losing data
- Keep same `applicationId`: `com.plot.app`
- Install new APK over old app (do not uninstall)

## 5) For release updates
- Create one signing keystore and reuse it forever.
- Each update: increment `versionCode` and `versionName` in `app/build.gradle`.
- Build signed APK and install over existing app.

This preserves local app data (lists, episode tracking, watch history).
