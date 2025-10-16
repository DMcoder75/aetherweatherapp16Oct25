import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const ForecastScreen = ({ route }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>7-Day Forecast</Text>
        <Text style={styles.subtitle}>Coming soon...</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: scale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: '#94a3b8',
  },
});

export default ForecastScreen;

