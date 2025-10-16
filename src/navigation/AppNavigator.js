import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ForecastScreen from '../screens/ForecastScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useLocation } from '../hooks/useLocation';
import { useWeather } from '../hooks/useWeather';
import { colors, fontSize, spacing } from '../utils/theme';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const { weatherData, loading: weatherLoading } = useWeather(location);

  // Show loading screen while getting location
  if (locationLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  // Show error if location access failed
  if (locationError && !location) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Location Access Required</Text>
        <Text style={styles.errorText}>
          Please enable location permissions to use Aether Weather.
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.secondary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              weatherData={weatherData}
              loading={weatherLoading}
              location={location}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Forecast">
          {(props) => (
            <ForecastScreen
              {...props}
              weatherData={weatherData}
              loading={weatherLoading}
              location={location}
            />
          )}
        </Stack.Screen>
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: fontSize.lg,
    color: colors.text.secondary,
  },
  errorTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default AppNavigator;

