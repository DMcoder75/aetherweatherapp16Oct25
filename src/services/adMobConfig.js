import { Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';

// AdMob App IDs (Replace with your actual AdMob App IDs)
export const ADMOB_APP_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544~1458002511', // Test App ID for iOS
  android: 'ca-app-pub-3940256099942544~3347511713', // Test App ID for Android
});

// AdMob Ad Unit IDs (Replace with your actual Ad Unit IDs)
export const AD_UNIT_IDS = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test Banner ID for iOS
    android: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID for Android
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910', // Test Interstitial ID for iOS
    android: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial ID for Android
  }),
};

// Initialize AdMob
export const initializeAdMob = async () => {
  try {
    await mobileAds().initialize();
    console.log('AdMob initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
    return false;
  }
};

export default {
  ADMOB_APP_ID,
  AD_UNIT_IDS,
  initializeAdMob,
};

