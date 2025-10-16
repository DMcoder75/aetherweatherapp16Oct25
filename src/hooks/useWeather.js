import { useState, useEffect } from 'react';

const OPEN_METEO_API = 'https://api.open-meteo.com/v1/forecast';

export const useWeather = (location) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    if (!location?.latitude || !location?.longitude) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { latitude, longitude } = location;
      
      // Build API URL with all required parameters
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
        ].join(','),
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'precipitation_probability',
          'precipitation',
          'weather_code',
          'wind_speed_10m',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_sum',
          'precipitation_probability_max',
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
      });

      const url = `${OPEN_METEO_API}?${params.toString()}`;
      console.log('Fetching weather from:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Weather data received');

      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const refreshWeather = () => {
    fetchWeatherData();
  };

  return {
    weatherData,
    loading,
    error,
    refreshWeather,
  };
};

export default useWeather;

