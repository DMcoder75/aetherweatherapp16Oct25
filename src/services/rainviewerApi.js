/**
 * RainViewer API Integration
 * 
 * Provides access to real-time weather radar and satellite imagery
 * API Documentation: https://www.rainviewer.com/api/weather-maps-api.html
 * 
 * Note: As of September 2025, the API has limitations:
 * - Tiled API limited to zoom level 10 for free users
 * - Rate limiting: 1000 requests/IP/minute
 * - Composite images available for Patrons only
 */

const RAINVIEWER_API_URL = 'https://api.rainviewer.com/public/weather-maps.json';

/**
 * Fetch weather maps metadata from RainViewer API
 * Returns radar past/nowcast data and satellite infrared data
 */
export async function fetchWeatherMaps() {
  try {
    const response = await fetch(RAINVIEWER_API_URL);
    if (!response.ok) {
      throw new Error(`RainViewer API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching RainViewer weather maps:', error);
    throw error;
  }
}

/**
 * Construct tile URL for weather radar
 * 
 * @param {string} host - Base host URL from API response
 * @param {string} path - Path from frame object
 * @param {number} z - Zoom level (max 10 for free users)
 * @param {number} x - Tile X coordinate
 * @param {number} y - Tile Y coordinate
 * @param {number} size - Tile size (256, 512, etc.)
 * @param {number} color - Color scheme (0-8)
 * @param {string} options - Additional options (e.g., '0_1' for smooth, '1_1' for snow)
 * @returns {string} Complete tile URL
 */
export function constructRadarTileUrl(host, path, z, x, y, size = 256, color = 2, options = '1_1') {
  return `${host}${path}/${size}/${z}/${x}/${y}/${color}/${options}.png`;
}

/**
 * Construct radar image URL centered at specific coordinates
 * 
 * @param {string} host - Base host URL from API response
 * @param {string} path - Path from frame object
 * @param {number} z - Zoom level (max 10 for free users)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} size - Image size (256, 512, etc.)
 * @param {number} color - Color scheme (0-8)
 * @param {string} options - Additional options
 * @returns {string} Complete image URL
 */
export function constructRadarCoordinateUrl(host, path, z, lat, lon, size = 512, color = 2, options = '1_1') {
  return `${host}${path}/${size}/${z}/${lat}/${lon}/${color}/${options}.png`;
}

/**
 * Get the latest radar frame
 * 
 * @param {object} weatherMaps - Weather maps data from API
 * @returns {object|null} Latest radar frame with time and path
 */
export function getLatestRadarFrame(weatherMaps) {
  if (!weatherMaps || !weatherMaps.radar || !weatherMaps.radar.past) {
    return null;
  }
  const past = weatherMaps.radar.past;
  return past.length > 0 ? past[past.length - 1] : null;
}

/**
 * Get all past radar frames
 * 
 * @param {object} weatherMaps - Weather maps data from API
 * @returns {array} Array of radar frames
 */
export function getPastRadarFrames(weatherMaps) {
  if (!weatherMaps || !weatherMaps.radar || !weatherMaps.radar.past) {
    return [];
  }
  return weatherMaps.radar.past;
}

/**
 * Get nowcast (forecast) radar frames
 * Note: Nowcast will be discontinued on January 1, 2026
 * 
 * @param {object} weatherMaps - Weather maps data from API
 * @returns {array} Array of nowcast frames
 */
export function getNowcastRadarFrames(weatherMaps) {
  if (!weatherMaps || !weatherMaps.radar || !weatherMaps.radar.nowcast) {
    return [];
  }
  return weatherMaps.radar.nowcast;
}

/**
 * Get satellite infrared frames
 * Note: Satellite IR maps will be discontinued on January 1, 2026
 * 
 * @param {object} weatherMaps - Weather maps data from API
 * @returns {array} Array of satellite frames
 */
export function getSatelliteFrames(weatherMaps) {
  if (!weatherMaps || !weatherMaps.satellite || !weatherMaps.satellite.infrared) {
    return [];
  }
  return weatherMaps.satellite.infrared;
}

/**
 * Convert Unix timestamp to readable date/time
 * 
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date/time string
 */
export function formatRadarTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

/**
 * Calculate tile coordinates from lat/lon at given zoom level
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} zoom - Zoom level
 * @returns {object} Object with x and y tile coordinates
 */
export function latLonToTile(lat, lon, zoom) {
  const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
  return { x, y };
}

/**
 * Color schemes available in RainViewer
 * 0 - Original (Rain Viewer)
 * 1 - Universal Blue
 * 2 - TITAN (default)
 * 3 - The Weather Channel
 * 4 - Meteored
 * 5 - NEXRAD Level III
 * 6 - Rainbow @ SELEX-IS
 * 7 - Dark Sky
 * 8 - Black & White Values
 */
export const COLOR_SCHEMES = {
  ORIGINAL: 0,
  UNIVERSAL_BLUE: 1,
  TITAN: 2,
  WEATHER_CHANNEL: 3,
  METEORED: 4,
  NEXRAD: 5,
  RAINBOW: 6,
  DARK_SKY: 7,
  BLACK_WHITE: 8
};

