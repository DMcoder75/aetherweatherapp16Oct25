import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Card from '../components/Card';
import { colors, fontSize, spacing, borderRadius } from '../utils/theme';

const HomeScreen = ({ weatherData, loading, location, navigation }) => {
  const [aiInsight, setAiInsight] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (weatherData) {
      generateQuickInsight();
    }
  }, [weatherData]);

  const generateQuickInsight = () => {
    if (!weatherData) return;

    const { current, daily } = weatherData;
    const temp = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;
    const precipitation = current.precipitation;

    let insight = '';

    if (temp > 30) {
      insight = `High Temperature Alert: Current temperature is ${temp.toFixed(1)}°C. UV index is ${daily.uv_index_max[0].toFixed(1)}. Stay hydrated and use sunscreen.`;
    } else if (temp < 5) {
      insight = `Cold Weather Advisory: Temperature has dropped to ${temp.toFixed(1)}°C. Feels like ${current.apparent_temperature.toFixed(1)}°C. Dress in layers.`;
    } else if (precipitation > 0) {
      insight = `Active Precipitation: Currently experiencing ${precipitation}mm of precipitation. Expect wet conditions.`;
    } else if (windSpeed > 20) {
      insight = `Strong Wind Warning: Wind speeds reaching ${windSpeed.toFixed(1)} km/h with gusts up to ${current.wind_gusts_10m.toFixed(1)} km/h.`;
    } else if (humidity > 80) {
      insight = `High Humidity Conditions: Humidity levels at ${humidity}%. Expect muggy conditions.`;
    } else {
      insight = `Favorable Conditions: Atmospheric pressure is stable at ${current.pressure_msl.toFixed(0)} hPa with balanced temperature (${temp.toFixed(1)}°C).`;
    }

    setAiInsight(insight);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Trigger weather data refresh here
    setTimeout(() => setRefreshing(false), 2000);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No weather data available</Text>
      </View>
    );
  }

  const { current } = weatherData;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.locationText}>{location?.name || 'Unknown Location'}</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      </View>

      <Card style={styles.currentWeatherCard} variant="elevated">
        <Text style={styles.temperatureText}>{current.temperature_2m.toFixed(1)}°C</Text>
        <Text style={styles.feelsLikeText}>
          Feels like {current.apparent_temperature.toFixed(1)}°C
        </Text>
      </Card>

      <Card style={styles.insightCard}>
        <Text style={styles.insightTitle}>Weather Insight</Text>
        <Text style={styles.insightText}>{aiInsight}</Text>
      </Card>

      <View style={styles.detailsGrid}>
        <Card style={styles.detailCard}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{current.relative_humidity_2m}%</Text>
        </Card>
        <Card style={styles.detailCard}>
          <Text style={styles.detailLabel}>Wind Speed</Text>
          <Text style={styles.detailValue}>{current.wind_speed_10m.toFixed(1)} km/h</Text>
        </Card>
        <Card style={styles.detailCard}>
          <Text style={styles.detailLabel}>Precipitation</Text>
          <Text style={styles.detailValue}>{current.precipitation} mm</Text>
        </Card>
        <Card style={styles.detailCard}>
          <Text style={styles.detailLabel}>Pressure</Text>
          <Text style={styles.detailValue}>{current.pressure_msl.toFixed(0)} hPa</Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(16),
    color: '#94a3b8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  errorText: {
    fontSize: moderateScale(16),
    color: '#ef4444',
  },
  header: {
    padding: scale(20),
    paddingTop: verticalScale(40),
  },
  locationText: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  dateText: {
    fontSize: moderateScale(14),
    color: '#94a3b8',
    marginTop: verticalScale(4),
  },
  currentWeatherCard: {
    margin: spacing.lg,
    marginTop: 0,
    alignItems: 'center',
  },
  temperatureText: {
    fontSize: moderateScale(64),
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  feelsLikeText: {
    fontSize: moderateScale(16),
    color: '#94a3b8',
    marginTop: verticalScale(8),
  },
  insightCard: {
    margin: spacing.lg,
    marginTop: 0,
  },
  insightTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: verticalScale(8),
  },
  insightText: {
    fontSize: moderateScale(14),
    color: '#cbd5e1',
    lineHeight: moderateScale(20),
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: scale(10),
  },
  detailCard: {
    width: '45%',
    margin: spacing.sm,
  },
  detailLabel: {
    fontSize: moderateScale(12),
    color: '#94a3b8',
    marginBottom: verticalScale(4),
  },
  detailValue: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#f8fafc',
  },
});

export default HomeScreen;

