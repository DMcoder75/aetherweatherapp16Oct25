# Aether Weather Mobile 🌤️

A professional React Native weather application with AI-powered insights, Google AdMob integration, and in-app purchase subscriptions.

## Features

- ✅ **Real-time Weather Data** - Powered by Open-Meteo API
- ✅ **Location-based Forecasting** - Automatic location detection
- ✅ **7-Day Forecast** - Detailed weather predictions
- ✅ **Google AdMob Integration** - Banner advertisements
- ✅ **In-App Purchases** - $10 subscription for ad-free experience
- ✅ **Responsive UI** - Optimized for all Android and iOS devices
- ✅ **Professional Design** - Beautiful splash screen and modern interface

## Quick Start - Download APK

### Option 1: GitHub Actions Build (Recommended)

1. Push this code to your GitHub repository
2. Go to **Actions** tab → **Build Android APK & AAB**
3. Click **Run workflow** → Select branch → **Run workflow**
4. Wait 5-10 minutes for build to complete
5. Download APK from **Artifacts** section

### Option 2: Manual Build

See detailed instructions in [BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md)

## GitHub Actions Setup

This repository includes automated CI/CD:

**Automatic Builds** (on every push to main/master):
- Debug APK
- Release APK  
- Release AAB

**Manual Release Creation**:
1. Go to Actions → Build Android APK & AAB
2. Run workflow with "Create a GitHub release" checked
3. Download from Releases page

## Configuration Required Before Publishing

### 1. AdMob IDs
Update `src/services/adMobConfig.js` with your AdMob IDs from https://admob.google.com

### 2. In-App Purchase
Update product ID in `src/hooks/useSubscription.js` and configure in Google Play Console / App Store Connect

### 3. Supabase (Optional)
Update credentials in `src/services/supabaseClient.js` if using authentication

## Project Structure

```
src/
├── components/         # Reusable UI components (Card, AdBanner)
├── context/            # React Context (Supabase)
├── hooks/              # Custom hooks (useLocation, useWeather, useSubscription)
├── navigation/         # App navigation
├── screens/            # App screens (Home, Forecast, Settings)
├── services/           # External services (AdMob, Supabase)
└── utils/              # Theme and helpers
```

## Technologies

- React Native
- React Navigation
- Google Mobile Ads
- React Native IAP
- Geolocation & Permissions
- Supabase
- AsyncStorage

## Documentation

- [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) - Detailed migration and setup notes
- [BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md) - Local build guide
- [README.original.md](./README.original.md) - Original React Native README

## License

MIT License

---

**Note**: Currently using test AdMob IDs. Replace with production IDs before publishing.

