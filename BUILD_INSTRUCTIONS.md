# Build Instructions

## Prerequisites

### For Android Builds:
- **Node.js** 18 or higher
- **JDK** 17 (required for Gradle 9.0)
- **Android SDK** with:
  - Platform: android-34
  - Build Tools: 34.0.0
  - Platform Tools
  - Command-line Tools

### For iOS Builds:
- **macOS** (required)
- **Xcode** 14+
- **CocoaPods**
- **Node.js** 18+

## Environment Setup

### Android SDK Setup

```bash
# Set environment variables (add to ~/.bashrc or ~/.zshrc)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0

# Verify installation
sdkmanager --version
```

### Java 17 Setup

```bash
# Ubuntu/Debian
sudo apt-get install openjdk-17-jdk

# macOS (using Homebrew)
brew install openjdk@17

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64  # Linux
export JAVA_HOME=/opt/homebrew/opt/openjdk@17         # macOS

# Verify
java -version  # Should show version 17.x.x
```

## Building Android APK

### Step 1: Install Dependencies

```bash
cd AetherWeatherMobile
npm install
```

### Step 2: Build Release APK

```bash
cd android
./gradlew assembleRelease --no-daemon
```

**Output location**: `android/app/build/outputs/apk/release/app-release.apk`

### Step 3: Build Release AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease --no-daemon
```

**Output location**: `android/app/build/outputs/bundle/release/app-release.aab`

### Troubleshooting Android Build

#### Issue: "Gradle requires JVM 17"
**Solution**: Ensure Java 17 is set as JAVA_HOME

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
java -version  # Verify it shows 17.x.x
```

#### Issue: "SDK location not found"
**Solution**: Create `android/local.properties`:

```properties
sdk.dir=/home/YOUR_USERNAME/Android/Sdk
```

#### Issue: "react-native-reanimated error"
**Solution**: This package has been removed. If you see this error, run:

```bash
npm uninstall react-native-reanimated react-native-gesture-handler
cd android && ./gradlew clean
```

## Building iOS (macOS only)

### Step 1: Install Dependencies

```bash
cd AetherWeatherMobile
npm install
cd ios
pod install
cd ..
```

### Step 2: Build with Xcode

```bash
open ios/AetherWeatherMobile.xcworkspace
```

In Xcode:
1. Select your development team
2. Choose target device/simulator
3. Product → Archive
4. Distribute App → Ad Hoc / App Store

### Step 3: Build from Command Line

```bash
cd ios
xcodebuild -workspace AetherWeatherMobile.xcworkspace \
  -scheme AetherWeatherMobile \
  -configuration Release \
  -archivePath build/AetherWeatherMobile.xcarchive \
  archive
```

## Signing Configuration

### Android Signing (for Production)

1. Generate keystore:

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore aether-weather-release.keystore \
  -alias aether-weather \
  -keyalg RSA -keysize 2048 -validity 10000
```

2. Create `android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=aether-weather-release.keystore
MYAPP_RELEASE_KEY_ALIAS=aether-weather
MYAPP_RELEASE_STORE_PASSWORD=YOUR_PASSWORD
MYAPP_RELEASE_KEY_PASSWORD=YOUR_PASSWORD
```

3. Update `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ...
        }
    }
}
```

### iOS Signing

Configure in Xcode:
1. Open project settings
2. Signing & Capabilities
3. Select your team
4. Enable "Automatically manage signing"

## Build Variants

### Debug Build (for testing)

```bash
# Android
cd android && ./gradlew assembleDebug

# iOS
npx react-native run-ios --configuration Debug
```

### Release Build (for production)

```bash
# Android
cd android && ./gradlew assembleRelease

# iOS - use Xcode Archive
```

## Testing the APK

### Install on Physical Device

```bash
# Via ADB
adb install android/app/build/outputs/apk/release/app-release.apk

# Or transfer APK to device and install manually
```

### Test on Emulator

```bash
# Start emulator
emulator -avd YOUR_AVD_NAME

# Install APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Build Optimization

### Reduce APK Size

1. Enable ProGuard in `android/app/build.gradle`:

```gradle
def enableProguardInReleaseBuilds = true
```

2. Enable app bundle:

```bash
./gradlew bundleRelease
```

3. Remove unused resources in `android/app/build.gradle`:

```gradle
android {
    buildTypes {
        release {
            shrinkResources true
            minifyEnabled true
        }
    }
}
```

## Common Build Times

- **First build**: 5-10 minutes
- **Incremental builds**: 1-3 minutes
- **Clean builds**: 3-5 minutes

## Next Steps After Building

1. Test APK on multiple devices
2. Replace test AdMob IDs with production IDs
3. Configure in-app purchases in Play Console
4. Submit to Google Play Store / App Store
5. Monitor crash reports and analytics

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Android Studio Setup](https://developer.android.com/studio)
- [Xcode Setup](https://developer.apple.com/xcode/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com/)

