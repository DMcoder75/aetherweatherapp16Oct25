import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { SupabaseProvider } from './context/SupabaseContext';
import { initializeAdMob } from './services/adMobConfig';
import AdBanner from './components/AdBanner';
import { colors } from './utils/theme';

const App = () => {
  const [adMobInitialized, setAdMobInitialized] = useState(false);

  useEffect(() => {
    // Initialize AdMob on app start
    const initAds = async () => {
      const initialized = await initializeAdMob();
      setAdMobInitialized(initialized);
    };
    
    initAds();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SupabaseProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
          <View style={styles.content}>
            <AppNavigator />
          </View>
          {adMobInitialized && <AdBanner />}
        </SafeAreaView>
      </SupabaseProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
});

export default App;

