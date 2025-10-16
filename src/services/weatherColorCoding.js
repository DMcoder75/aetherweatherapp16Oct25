// Weather Color Coding Utilities
// Provides intelligent color coding for weather metrics based on critical thresholds

export function getTemperatureColor(temp) {
  if (temp >= 40) return { color: '#DC2626', label: 'Extreme Heat', severity: 'critical' } // Red-600
  if (temp >= 35) return { color: '#EA580C', label: 'Very Hot', severity: 'high' } // Orange-600
  if (temp >= 30) return { color: '#F59E0B', label: 'Hot', severity: 'moderate' } // Amber-500
  if (temp >= 25) return { color: '#10B981', label: 'Warm', severity: 'low' } // Green-500
  if (temp >= 15) return { color: '#06B6D4', label: 'Comfortable', severity: 'low' } // Cyan-500
  if (temp >= 10) return { color: '#3B82F6', label: 'Cool', severity: 'low' } // Blue-500
  if (temp >= 0) return { color: '#6366F1', label: 'Cold', severity: 'moderate' } // Indigo-500
  return { color: '#A5F3FC', label: 'Freezing', severity: 'high' } // Cyan-200 (ice)
}

export function getHumidityColor(humidity) {
  if (humidity >= 85) return { color: '#DC2626', label: 'Very Humid', severity: 'high' } // Red-600
  if (humidity >= 70) return { color: '#F59E0B', label: 'Humid', severity: 'moderate' } // Amber-500
  if (humidity >= 30) return { color: '#10B981', label: 'Comfortable', severity: 'low' } // Green-500
  if (humidity >= 20) return { color: '#F59E0B', label: 'Dry', severity: 'moderate' } // Amber-500
  return { color: '#EA580C', label: 'Very Dry', severity: 'high' } // Orange-600
}

export function getWindSpeedColor(windSpeed) {
  if (windSpeed >= 75) return { color: '#7C2D12', label: 'Dangerous', severity: 'critical' } // Brown-900
  if (windSpeed >= 60) return { color: '#DC2626', label: 'Very Strong', severity: 'high' } // Red-600
  if (windSpeed >= 40) return { color: '#EA580C', label: 'Strong', severity: 'moderate' } // Orange-600
  if (windSpeed >= 20) return { color: '#F59E0B', label: 'Windy', severity: 'low' } // Amber-500
  if (windSpeed >= 10) return { color: '#10B981', label: 'Breezy', severity: 'low' } // Green-500
  return { color: '#06B6D4', label: 'Calm', severity: 'low' } // Cyan-500
}

export function getUVIndexColor(uvIndex) {
  if (uvIndex >= 11) return { color: '#7C2D12', label: 'Extreme', severity: 'critical' } // Brown-900
  if (uvIndex >= 8) return { color: '#DC2626', label: 'Very High', severity: 'high' } // Red-600
  if (uvIndex >= 6) return { color: '#EA580C', label: 'High', severity: 'moderate' } // Orange-600
  if (uvIndex >= 3) return { color: '#F59E0B', label: 'Moderate', severity: 'low' } // Amber-500
  return { color: '#10B981', label: 'Low', severity: 'low' } // Green-500
}

export function getPrecipitationColor(precipProb) {
  if (precipProb >= 80) return { color: '#DC2626', label: 'Very Likely', severity: 'high' } // Red-600
  if (precipProb >= 60) return { color: '#EA580C', label: 'Likely', severity: 'moderate' } // Orange-600
  if (precipProb >= 40) return { color: '#F59E0B', label: 'Possible', severity: 'low' } // Amber-500
  if (precipProb >= 20) return { color: '#10B981', label: 'Unlikely', severity: 'low' } // Green-500
  return { color: '#06B6D4', label: 'Very Unlikely', severity: 'low' } // Cyan-500
}

export function getVisibilityColor(visibility) {
  if (visibility < 1) return { color: '#DC2626', label: 'Very Poor', severity: 'high' } // Red-600
  if (visibility < 4) return { color: '#EA580C', label: 'Poor', severity: 'moderate' } // Orange-600
  if (visibility < 10) return { color: '#F59E0B', label: 'Moderate', severity: 'low' } // Amber-500
  return { color: '#10B981', label: 'Good', severity: 'low' } // Green-500
}

export function getPressureColor(pressure) {
  // Standard atmospheric pressure is 1013 hPa
  if (pressure < 980) return { color: '#DC2626', label: 'Very Low', severity: 'high' } // Red-600 (storm)
  if (pressure < 1000) return { color: '#EA580C', label: 'Low', severity: 'moderate' } // Orange-600
  if (pressure >= 1030) return { color: '#3B82F6', label: 'Very High', severity: 'moderate' } // Blue-500
  if (pressure >= 1020) return { color: '#06B6D4', label: 'High', severity: 'low' } // Cyan-500
  return { color: '#10B981', label: 'Normal', severity: 'low' } // Green-500
}

export function getCloudCoverColor(cloudCover) {
  if (cloudCover >= 90) return { color: '#64748B', label: 'Overcast', severity: 'low' } // Slate-500
  if (cloudCover >= 70) return { color: '#94A3B8', label: 'Mostly Cloudy', severity: 'low' } // Slate-400
  if (cloudCover >= 40) return { color: '#CBD5E1', label: 'Partly Cloudy', severity: 'low' } // Slate-300
  if (cloudCover >= 10) return { color: '#F59E0B', label: 'Mostly Clear', severity: 'low' } // Amber-500
  return { color: '#FBBF24', label: 'Clear', severity: 'low' } // Amber-400
}

// Get color with severity badge
export function getColorWithBadge(value, type) {
  let colorData
  
  switch (type) {
    case 'temperature':
      colorData = getTemperatureColor(value)
      break
    case 'humidity':
      colorData = getHumidityColor(value)
      break
    case 'wind':
      colorData = getWindSpeedColor(value)
      break
    case 'uv':
      colorData = getUVIndexColor(value)
      break
    case 'precipitation':
      colorData = getPrecipitationColor(value)
      break
    case 'visibility':
      colorData = getVisibilityColor(value)
      break
    case 'pressure':
      colorData = getPressureColor(value)
      break
    case 'cloudCover':
      colorData = getCloudCoverColor(value)
      break
    default:
      colorData = { color: '#10B981', label: 'Normal', severity: 'low' }
  }
  
  return colorData
}

// Get severity icon
export function getSeverityIcon(severity) {
  switch (severity) {
    case 'critical':
      return '🚨'
    case 'high':
      return '⚠️'
    case 'moderate':
      return '⚡'
    case 'low':
    default:
      return '✓'
  }
}

