# iOS Build Guide

## Important Note

**iOS apps can only be built on macOS** with Xcode installed. This guide provides instructions for building the iOS version of Aether Weather on a Mac.

## Prerequisites

### Required:
- **macOS** 12.0 (Monterey) or later
- **Xcode** 14.0 or later (from Mac App Store)
- **Xcode Command Line Tools**
- **CocoaPods** (dependency manager)
- **Node.js** 18 or later
- **Apple Developer Account** ($99/year for App Store distribution)

### Installation

#### 1. Install Xcode

```bash
# Install from Mac App Store or
xcode-select --install
```

#### 2. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 3. Install Node.js

```bash
brew install node@18
```

#### 4. Install CocoaPods

```bash
sudo gem install cocoapods
```

## Setup iOS Project

### Step 1: Install Dependencies

```bash
cd AetherWeatherMobile

# Install npm packages
npm install

# Install iOS pods
cd ios
pod install
cd ..
```

### Step 2: Configure Splash Screen for iOS

The splash screen needs to be added to iOS assets:

1. Open Xcode:
   ```bash
   open ios/AetherWeatherMobile.xcworkspace
   ```

2. In Xcode, navigate to:
   - `AetherWeatherMobile` → `Images.xcassets` → `LaunchImage`

3. Add splash screen images for different sizes:
   - Use `assets/splash-screen-final.png` as source
   - Generate required sizes using online tools or Image Asset Generator

### Step 3: Update Info.plist

The location permissions are already configured, but verify:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Aether Weather needs access to your location to provide accurate weather forecasts for your area.</string>
```

### Step 4: Configure AdMob

Add AdMob App ID to `ios/AetherWeatherMobile/Info.plist`:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>
```

Replace with your actual AdMob App ID from https://admob.google.com

## Building for Development

### Run on Simulator

```bash
# List available simulators
xcrun simctl list devices

# Run on default simulator
npx react-native run-ios

# Run on specific device
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Run on Physical Device

1. Connect iPhone/iPad via USB
2. Open Xcode workspace:
   ```bash
   open ios/AetherWeatherMobile.xcworkspace
   ```
3. Select your device from device dropdown
4. Click Run button (▶️) or press Cmd+R

**Note**: You'll need to trust your developer certificate on the device:
- Settings → General → Device Management → Trust

## Building for Distribution

### Step 1: Configure Signing

1. Open Xcode workspace
2. Select project in navigator
3. Select target "AetherWeatherMobile"
4. Go to "Signing & Capabilities" tab
5. Select your Team (requires Apple Developer account)
6. Ensure "Automatically manage signing" is checked

### Step 2: Update Version and Build Number

In Xcode:
- Select project → General tab
- Update **Version** (e.g., 1.0.0)
- Update **Build** (e.g., 1)

Or edit `ios/AetherWeatherMobile/Info.plist`:

```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

### Step 3: Create Archive

#### Using Xcode (Recommended):

1. Open workspace in Xcode
2. Select "Any iOS Device (arm64)" from device dropdown
3. Product → Archive
4. Wait for archive to complete (5-10 minutes)
5. Organizer window will open automatically

#### Using Command Line:

```bash
cd ios

xcodebuild -workspace AetherWeatherMobile.xcworkspace \
  -scheme AetherWeatherMobile \
  -configuration Release \
  -archivePath build/AetherWeatherMobile.xcarchive \
  archive
```

### Step 4: Export IPA

#### For Ad Hoc Distribution (Testing):

1. In Organizer, select your archive
2. Click "Distribute App"
3. Select "Ad Hoc"
4. Select distribution options
5. Select signing certificate
6. Click "Export"
7. Choose save location

The `.ipa` file can be installed on registered test devices.

#### For App Store Distribution:

1. In Organizer, select your archive
2. Click "Distribute App"
3. Select "App Store Connect"
4. Click "Upload"
5. Follow prompts to upload to App Store Connect

#### Using Command Line:

```bash
xcodebuild -exportArchive \
  -archivePath build/AetherWeatherMobile.xcarchive \
  -exportPath build/Release \
  -exportOptionsPlist ExportOptions.plist
```

## Installing IPA on Device

### Method 1: Xcode

1. Window → Devices and Simulators
2. Select your device
3. Click "+" under Installed Apps
4. Select the .ipa file

### Method 2: Apple Configurator

1. Install Apple Configurator from Mac App Store
2. Connect device
3. Drag .ipa file to device

### Method 3: TestFlight (Recommended for Testing)

1. Upload build to App Store Connect
2. Add internal/external testers
3. Testers install via TestFlight app

## App Store Submission

### Prerequisites:

1. **Apple Developer Account** ($99/year)
2. **App Store Connect** access
3. **App listing** created in App Store Connect

### Steps:

#### 1. Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. My Apps → "+" → New App
3. Fill in app information:
   - Platform: iOS
   - Name: Aether Weather
   - Primary Language: English
   - Bundle ID: com.aetherweather.mobile (or your chosen ID)
   - SKU: AETHERWEATHER001

#### 2. Prepare App Listing

Required information:
- **App Name**: Aether Weather
- **Subtitle**: Your Personal Weather Companion
- **Description**: Professional weather forecasting app...
- **Keywords**: weather, forecast, temperature, climate
- **Screenshots**: Required for all device sizes
- **App Icon**: 1024x1024px (use `assets/app-icon.png`)
- **Privacy Policy URL**: Required
- **Support URL**: Required

#### 3. Configure In-App Purchases

1. Features → In-App Purchases → "+"
2. Type: Auto-Renewable Subscription
3. Reference Name: Ad-Free Subscription
4. Product ID: com.aetherweather.adfree
5. Subscription Duration: 1 month
6. Price: $9.99

#### 4. Upload Build

```bash
# Archive in Xcode
# Product → Archive

# In Organizer:
# Distribute App → App Store Connect → Upload
```

#### 5. Submit for Review

1. Select uploaded build in App Store Connect
2. Complete all required fields
3. Add to submission
4. Submit for Review

**Review time**: Typically 24-48 hours

## iOS-Specific Configurations

### Update App Icon

1. Generate icon set (1024x1024 source)
2. Use online tool or Xcode to create all sizes
3. Add to `ios/AetherWeatherMobile/Images.xcassets/AppIcon.appiconset`

### Configure Capabilities

In Xcode → Signing & Capabilities:

- ✅ Location Services (already configured)
- ✅ In-App Purchase (add if needed)
- ✅ Push Notifications (if adding notifications)

### Update Display Name

Edit `ios/AetherWeatherMobile/Info.plist`:

```xml
<key>CFBundleDisplayName</key>
<string>Aether Weather</string>
```

## Troubleshooting

### Issue: "No provisioning profiles found"

**Solution**: 
1. Xcode → Preferences → Accounts
2. Add Apple ID
3. Download Manual Profiles

### Issue: "Code signing error"

**Solution**:
1. Clean build folder (Cmd+Shift+K)
2. Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`
3. Restart Xcode

### Issue: "Pod install fails"

**Solution**:
```bash
cd ios
pod deintegrate
pod install
```

### Issue: "Build fails with module not found"

**Solution**:
```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
```

### Issue: "App crashes on launch"

**Solution**:
- Check console logs in Xcode
- Verify all required permissions in Info.plist
- Check AdMob configuration

## GitHub Actions for iOS (Optional)

**Note**: iOS builds on GitHub Actions require:
- macOS runners (10x cost multiplier)
- Signing certificates and provisioning profiles as secrets
- More complex setup than Android

For most developers, building locally with Xcode is simpler and more cost-effective.

## Testing Checklist

Before submission:
- [ ] App launches without crashes
- [ ] Location permission prompt appears
- [ ] Weather data loads correctly
- [ ] AdMob ads display (use test IDs initially)
- [ ] Subscription flow works
- [ ] Settings screen functional
- [ ] Splash screen displays correctly
- [ ] App icon appears correctly
- [ ] Works on multiple iOS versions (iOS 13+)
- [ ] Works on different device sizes (iPhone, iPad)

## Resources

- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [React Native iOS Guide](https://reactnative.dev/docs/running-on-device)
- [CocoaPods](https://cocoapods.org/)
- [TestFlight](https://developer.apple.com/testflight/)

## Cost Summary

- **Apple Developer Program**: $99/year
- **Mac (if needed)**: $1000+ one-time
- **Xcode**: Free
- **CocoaPods**: Free

## Next Steps

1. Set up Mac with Xcode
2. Install dependencies
3. Build and test on simulator
4. Test on physical device
5. Create App Store Connect listing
6. Submit for review

---

**Note**: iOS development requires macOS. If you don't have a Mac, consider:
- Using a Mac cloud service (MacStadium, AWS Mac instances)
- Borrowing/renting a Mac
- Partnering with someone who has a Mac
- Focusing on Android first, iOS later

