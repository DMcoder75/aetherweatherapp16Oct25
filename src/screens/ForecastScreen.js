
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useWeather } from '../hooks/useWeather';
import { useLocation } from '../hooks/useLocation';
import { format } from 'date-fns';

const ForecastScreen = () => {
  const { location, loading: locationLoading, error: locationError } = useLocation();
  const { weatherData, loading: weatherLoading, error: weatherError } = useWeather(location);

  const renderDailyForecast = () => {
    if (locationLoading || weatherLoading) {
      return <ActivityIndicator size="large" color="#60a5fa" />;
    }

    if (locationError) {
      return <Text style={styles.errorText}>Error getting location: {locationError}</Text>;
    }

    if (weatherError) {
      return <Text style={styles.errorText}>Error fetching weather: {weatherError}</Text>;
    }

    if (!weatherData || !weatherData.daily) {
      return <Text style={styles.subtitle}>No forecast data available.</Text>;
    }

    const daily = weatherData.daily;
    const dates = daily.time;
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;
    const weatherCodes = daily.weather_code;
    const precipitationSums = daily.precipitation_sum;
    const precipitationProbabilities = daily.precipitation_probability_max;

    return dates.map((date, index) => (
      <View key={date} style={styles.dailyForecastCard}>
        <Text style={styles.dateText}>{format(new Date(date), 'EEE, MMM d')}</Text>
        <View style={styles.forecastDetails}>
          <Text style={styles.tempText}>{Math.round(maxTemps[index])}°C / {Math.round(minTemps[index])}°C</Text>
          <Text style={styles.weatherCodeText}>Weather Code: {weatherCodes[index]}</Text>
          {precipitationSums[index] > 0 && (
            <Text style={styles.precipitationText}>Precipitation: {precipitationSums[index]} mm</Text>
          )}
          {precipitationProbabilities[index] > 0 && (
            <Text style={styles.precipitationText}>Chance of Rain: {precipitationProbabilities[index]}%</Text>
          )}
        </View>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>7-Day Forecast</Text>
        {renderDailyForecast()}
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
    marginBottom: verticalScale(16),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: '#ef4444',
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
  dailyForecastCard: {
    backgroundColor: '#1e293b',
    borderRadius: scale(10),
    padding: scale(15),
    marginBottom: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#f8fafc',
    flex: 1,
  },
  forecastDetails: {
    flex: 2,
    alignItems: 'flex-end',
  },
  tempText: {
    fontSize: moderateScale(16),
    color: '#cbd5e1',
  },
  weatherCodeText: {
    fontSize: moderateScale(14),
    color: '#94a3b8',
  },
  precipitationText: {
    fontSize: moderateScale(14),
    color: '#94a3b8',
  },
});

export default ForecastScreen;

