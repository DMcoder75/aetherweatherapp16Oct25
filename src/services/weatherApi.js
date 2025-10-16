// Weather API Integration
// Using Open-Meteo API for real-time weather data (no API key required)

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search for location coordinates
 * @param {string} cityName - City name to search
 * @returns {Promise<Object>} Location data with coordinates
 */
export async function searchLocation(cityName) {
  try {
    const response = await fetch(
      `${GEOCODING_API}?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`
    );
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('Location not found');
    }

    return data.results;
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
}

/**
 * Fetch comprehensive weather data for a location
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} Complete weather data
 */
export async function fetchWeatherData(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
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
        'wind_gusts_10m'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'dew_point_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'daylight_duration',
        'sunshine_duration',
        'uv_index_max',
        'precipitation_sum',
        'rain_sum',
        'showers_sum',
        'snowfall_sum',
        'precipitation_hours',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant'
      ].join(','),
      timezone: 'auto',
      forecast_days: 14
    });

    const response = await fetch(`${WEATHER_API}?${params.toString()}`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Get weather description from WMO code
 * @param {number} code - WMO weather code
 * @returns {string} Weather description
 */
export function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };

  return weatherCodes[code] || 'Unknown';
}

/**
 * Get weather severity level
 * @param {number} code - WMO weather code
 * @returns {string} Severity level: 'normal', 'moderate', 'severe'
 */
export function getWeatherSeverity(code) {
  if (code === 0 || code <= 3) return 'normal';
  if (code >= 95) return 'severe'; // Thunderstorms
  if (code >= 65 && code <= 67) return 'severe'; // Heavy rain/freezing rain
  if (code >= 75 && code <= 77) return 'severe'; // Heavy snow
  if (code >= 82) return 'severe'; // Violent showers
  if (code >= 51) return 'moderate'; // Drizzle, rain, snow
  return 'normal';
}

/**
 * Detect rapid weather changes in hourly forecast
 * @param {Object} hourlyData - Hourly weather data
 * @param {number} hoursAhead - Number of hours to analyze (default: 24)
 * @returns {Array} Array of detected changes
 */
export function detectRapidWeatherChanges(hourlyData, hoursAhead = 24) {
  const changes = [];
  const temps = hourlyData.temperature_2m.slice(0, hoursAhead);
  const codes = hourlyData.weather_code.slice(0, hoursAhead);
  const precip = hourlyData.precipitation_probability.slice(0, hoursAhead);

  for (let i = 1; i < temps.length; i++) {
    const tempChange = Math.abs(temps[i] - temps[i - 1]);
    const codeChange = codes[i] !== codes[i - 1];
    const precipChange = Math.abs(precip[i] - precip[i - 1]);

    // Detect significant temperature change (>5°C per hour)
    if (tempChange > 5) {
      changes.push({
        hour: i,
        type: 'temperature',
        description: `Rapid temperature ${temps[i] > temps[i - 1] ? 'rise' : 'drop'} of ${tempChange.toFixed(1)}°C`,
        severity: tempChange > 10 ? 'severe' : 'moderate'
      });
    }

    // Detect weather condition change
    if (codeChange && getWeatherSeverity(codes[i]) !== 'normal') {
      changes.push({
        hour: i,
        type: 'condition',
        description: `Weather changing to ${getWeatherDescription(codes[i])}`,
        severity: getWeatherSeverity(codes[i])
      });
    }

    // Detect rapid precipitation probability change (>30% per hour)
    if (precipChange > 30) {
      changes.push({
        hour: i,
        type: 'precipitation',
        description: `Precipitation probability ${precip[i] > precip[i - 1] ? 'increasing' : 'decreasing'} by ${precipChange}%`,
        severity: precip[i] > 70 ? 'moderate' : 'normal'
      });
    }
  }

  return changes;
}



/**
 * Fetch comprehensive weather data for a location using coordinates
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} Complete weather data
 */
export async function fetchWeatherByCoordinates(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
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
        'wind_gusts_10m'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'dew_point_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'visibility',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'daylight_duration',
        'sunshine_duration',
        'uv_index_max',
        'precipitation_sum',
        'rain_sum',
        'showers_sum',
        'snowfall_sum',
        'precipitation_hours',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant'
      ].join(','),
      timezone: 'auto',
      forecast_days: 14
    });

    const response = await fetch(`${WEATHER_API}?${params.toString()}`);
    const data = await response.json();

    // Geocoding to get location name from coordinates
    const geoResponse = await fetch(
      `${GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
    );
    const geoData = await geoResponse.json();

    let locationName = 'Unknown Location';
    if (geoData.results && geoData.results.length > 0) {
      const { name, country } = geoData.results[0];
      locationName = `${name}, ${country}`;
    }

    return { ...data, locationName };
  } catch (error) {
    console.error('Error fetching weather data by coordinates:', error);
    throw error;
  }
}

