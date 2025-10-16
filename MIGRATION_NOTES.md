# Aether Weather - React Native Migration Notes

## Overview
This document outlines all the changes made during the migration from the React web application to React Native mobile application.

## Key Changes Made

### 1. **Location Access Implementation** ✅
- **Hook**: `src/hooks/useLocation.js`
- **Features**:
  - Requests location permissions on app start
  - Shows permission dialog with clear explanation
  - Handles both Android and iOS permission systems
  - Provides user-friendly error messages
  - Supports location refresh functionality

- **Permissions Added**:
  - **Android** (`AndroidManifest.xml`):
    - `ACCESS_FINE_LOCATION`
    - `ACCESS_COARSE_LOCATION`
    - `ACCESS_NETWORK_STATE`
  
  - **iOS** (`Info.plist`):
    - `NSLocationWhenInUseUsageDescription`
    - `NSLocationAlwaysAndWhenInUseUsageDescription`

### 2. **Weather Data Fetching** ✅
- **Hook**: `src/hooks/useWeather.js`
- **API**: Open-Meteo API (https://api.open-meteo.com)
- **Data Retrieved**:
  - Current weather conditions
  - Hourly forecast (temperature, humidity, precipitation)
  - 7-day daily forecast
  - UV index, wind speed, pressure, etc.

### 3. **Responsive UI System** ✅
- **Library**: `react-native-size-matters`
- **Theme System**: `src/utils/theme.js`
  - Responsive spacing
  - Responsive font sizes
  - Color palette
  - Platform-specific shadows
  - Device size detection

- **Components**:
  - `Card` component with variants (default, elevated, outlined)
  - All screens use responsive scaling

### 4. **Google AdMob Integration** ✅
- **Configuration**: `src/services/adMobConfig.js`
- **Component**: `src/components/AdBanner.js`
- **Features**:
  - Banner ads at the bottom of screens
  - Automatically hidden for premium users
  - Adaptive banner size for different devices
  - Currently using **test Ad Unit IDs**

- **Setup Required Before Publishing**:
  1. Create AdMob account at https://admob.google.com
  2. Register your app
  3. Get real Ad Unit IDs
  4. Replace test IDs in `src/services/adMobConfig.js`
  5. Update App ID in:
     - `android/app/src/main/AndroidManifest.xml`
     - `ios/AetherWeatherMobile/Info.plist` (needs to be added)

### 5. **In-App Purchase Subscription** ✅
- **Hook**: `src/hooks/useSubscription.js`
- **Library**: `react-native-iap`
- **Features**:
  - $10 ad-free subscription
  - Purchase flow
  - Restore purchases functionality
  - Premium status stored in AsyncStorage

- **Setup Required Before Publishing**:
  1. **iOS**:
     - Create in-app purchase in App Store Connect
     - Set product ID (e.g., `com.aetherweather.adfree`)
     - Update product ID in `src/hooks/useSubscription.js`
  
  2. **Android**:
     - Create in-app product in Google Play Console
     - Set product ID (e.g., `com.aetherweather.adfree`)
     - Update product ID in `src/hooks/useSubscription.js`

### 6. **Navigation Structure** ✅
- **Library**: `@react-navigation/native` with stack navigator
- **Screens**:
  - **HomeScreen**: Main weather display with current conditions
  - **ForecastScreen**: Placeholder for 7-day forecast
  - **SettingsScreen**: Subscription management and app info

### 7. **Architecture Changes**

#### Directory Structure:
```
src/
├── components/         # Reusable UI components
│   ├── AdBanner.js
│   └── Card.js
├── context/           # React Context providers
│   └── SupabaseContext.js
├── hooks/             # Custom React hooks
│   ├── useLocation.js
│   ├── useSubscription.js
│   └── useWeather.js
├── navigation/        # Navigation configuration
│   └── AppNavigator.js
├── screens/           # Screen components
│   ├── HomeScreen.js
│   ├── ForecastScreen.js
│   └── SettingsScreen.js
├── services/          # External services and APIs
│   ├── adMobConfig.js
│   └── supabaseClient.js
├── utils/             # Utility functions and helpers
│   ├── authHelpers.js
│   └── theme.js
└── App.js             # Main app component
```

#### Web to Native Component Mapping:
| Web Component | React Native Component |
|--------------|------------------------|
| `<div>` | `<View>` |
| `<span>`, `<p>`, `<h1>` | `<Text>` |
| `<img>` | `<Image>` |
| `<button>` | `<TouchableOpacity>` or `<Button>` |
| CSS classes | `StyleSheet` objects |
| Tailwind CSS | Custom theme system |

### 8. **Removed/Replaced Dependencies**
- ❌ `framer-motion` (web-only) → Will use React Native Animated API
- ❌ `@radix-ui/*` (web-only) → Custom components or RN alternatives
- ❌ `react-router-dom` → `@react-navigation/native`
- ❌ `lucide-react` → Will need React Native icon library
- ❌ Tailwind CSS → Custom StyleSheet with theme system

### 9. **Preserved Functionality**
- ✅ Supabase authentication context
- ✅ Weather analysis logic (copied from `src/lib/`)
- ✅ Custom hooks (copied from `src/hooks/`)
- ✅ Core business logic and utilities

## Testing Checklist

### Location Access:
- [ ] App prompts for location permission on first launch
- [ ] Permission dialog shows clear explanation
- [ ] App handles permission denial gracefully
- [ ] Location updates when user moves
- [ ] Works on both Android and iOS

### Weather Data:
- [ ] Weather data loads based on current location
- [ ] Pull-to-refresh works on HomeScreen
- [ ] Error handling for API failures
- [ ] Loading states display correctly

### Ads:
- [ ] Banner ads display at bottom of screen (when using test IDs)
- [ ] Ads hide when user has premium subscription
- [ ] Ads don't interfere with content

### Subscription:
- [ ] Purchase flow initiates correctly
- [ ] Restore purchases works
- [ ] Premium status persists across app restarts
- [ ] Ads disappear after successful purchase

### Responsive UI:
- [ ] UI scales correctly on small phones (< 375px width)
- [ ] UI scales correctly on medium phones (375-414px width)
- [ ] UI scales correctly on large phones (> 414px width)
- [ ] UI scales correctly on tablets (> 768px width)
- [ ] Text remains readable on all devices
- [ ] Touch targets are appropriately sized

## Next Steps for Production

### 1. Complete Remaining Screens
- Implement full ForecastScreen with 7-day forecast
- Add more detailed weather information
- Implement alerts and notifications

### 2. AdMob Setup
- Create AdMob account
- Register app for both iOS and Android
- Get production Ad Unit IDs
- Update configuration files

### 3. In-App Purchase Setup
- Set up App Store Connect (iOS)
- Set up Google Play Console (Android)
- Create in-app products
- Test purchase flow in sandbox

### 4. Supabase Configuration
- Update Supabase URL and keys in `src/services/supabaseClient.js`
- Implement authentication screens if needed
- Test database connectivity

### 5. App Icons and Splash Screens
- Design app icon (1024x1024)
- Create adaptive icons for Android
- Create splash screen
- Update app name and branding

### 6. Build Configuration
- Update app name in `app.json`
- Set bundle identifier (iOS) and package name (Android)
- Configure signing certificates
- Set version numbers

## Important Notes

⚠️ **Current Limitations**:
- Using test AdMob IDs (must be replaced before publishing)
- Placeholder Supabase configuration
- ForecastScreen is incomplete
- No app icon or splash screen yet
- Some web app features not yet migrated (3D atmosphere, AI insights, etc.)

⚠️ **Before Building**:
- Replace all test/placeholder IDs with production values
- Test on real devices (both iOS and Android)
- Verify all permissions work correctly
- Test purchase flow in sandbox environments
- Ensure location access works in various scenarios

## Build Commands

### Android:
```bash
cd android
./gradlew assembleRelease  # For APK
./gradlew bundleRelease    # For AAB (Google Play)
```

### iOS:
```bash
cd ios
pod install
# Then open Xcode and archive
```

