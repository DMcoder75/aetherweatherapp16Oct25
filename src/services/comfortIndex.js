/**
 * Predictive Comfort Index
 * Calculates personalized comfort scores based on multiple weather factors
 */

/**
 * Calculate comprehensive comfort index
 * @param {Object} weatherData - Complete weather data from API
 * @returns {Object} Comfort analysis results
 */
export function calculateComfortIndex(weatherData) {
  if (!weatherData || !weatherData.current || !weatherData.hourly) {
    return {
      currentComfort: 50,
      hourlyComfort: [],
      optimalWindows: [],
      factors: {}
    }
  }

  const { current, hourly, daily } = weatherData

  // Calculate current comfort score
  const currentComfort = calculateComfortScore(
    current.temperature_2m,
    current.relative_humidity_2m,
    current.wind_speed_10m,
    daily?.uv_index_max?.[0] || 0,
    current.precipitation || 0,
    current.apparent_temperature
  )

  // Calculate hourly comfort scores for next 24 hours
  const hourlyComfort = []
  for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
    const score = calculateComfortScore(
      hourly.temperature_2m[i],
      hourly.relative_humidity_2m[i],
      hourly.wind_speed_10m[i],
      hourly.uv_index?.[i] || 0,
      hourly.precipitation[i] || 0,
      hourly.apparent_temperature[i]
    )
    
    hourlyComfort.push({
      hour: new Date(hourly.time[i]).getHours(),
      time: new Date(hourly.time[i]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      score: score,
      temperature: hourly.temperature_2m[i],
      feelsLike: hourly.apparent_temperature[i]
    })
  }

  // Find optimal time windows
  const optimalWindows = findOptimalWindows(hourlyComfort)

  // Calculate factor breakdown for current conditions
  const factors = calculateFactorBreakdown(
    current.temperature_2m,
    current.relative_humidity_2m,
    current.wind_speed_10m,
    daily?.uv_index_max?.[0] || 0,
    current.precipitation || 0,
    current.apparent_temperature
  )

  return {
    currentComfort,
    hourlyComfort,
    forecast: hourlyComfort, // Alias for chart compatibility
    optimalWindows,
    factors
  }
}

/**
 * Calculate comfort score (0-100)
 * Higher score = more comfortable
 */
function calculateComfortScore(temp, humidity, windSpeed, uvIndex, precipitation, feelsLike) {
  let score = 100

  // Temperature comfort (ideal: 18-24°C)
  const tempDiff = Math.abs(temp - 21) // 21°C is optimal
  if (tempDiff > 3) {
    score -= Math.min(30, tempDiff * 2)
  }

  // Feels-like temperature adjustment
  const feelsLikeDiff = Math.abs(feelsLike - temp)
  if (feelsLikeDiff > 3) {
    score -= Math.min(15, feelsLikeDiff * 1.5)
  }

  // Humidity comfort (ideal: 40-60%)
  if (humidity > 70) {
    score -= Math.min(20, (humidity - 70) * 0.5)
  } else if (humidity < 30) {
    score -= Math.min(20, (30 - humidity) * 0.5)
  }

  // Wind comfort (ideal: <15 km/h)
  if (windSpeed > 15) {
    score -= Math.min(20, (windSpeed - 15) * 0.5)
  }

  // UV index (lower is better for comfort)
  if (uvIndex > 5) {
    score -= Math.min(15, (uvIndex - 5) * 2)
  }

  // Precipitation (any precipitation reduces comfort)
  if (precipitation > 0) {
    score -= Math.min(25, precipitation * 5)
  }

  return Math.max(0, Math.round(score))
}

/**
 * Calculate detailed factor breakdown
 */
function calculateFactorBreakdown(temp, humidity, windSpeed, uvIndex, precipitation, feelsLike) {
  return {
    temperature: {
      score: calculateTemperatureScore(temp),
      impact: getTemperatureImpact(temp),
      value: temp,
      ideal: '18-24°C'
    },
    humidity: {
      score: calculateHumidityScore(humidity),
      impact: getHumidityImpact(humidity),
      value: humidity,
      ideal: '40-60%'
    },
    wind: {
      score: calculateWindScore(windSpeed),
      impact: getWindImpact(windSpeed),
      value: windSpeed,
      ideal: '<15 km/h'
    },
    uv: {
      score: calculateUVScore(uvIndex),
      impact: getUVImpact(uvIndex),
      value: uvIndex,
      ideal: '<5'
    },
    precipitation: {
      score: calculatePrecipitationScore(precipitation),
      impact: getPrecipitationImpact(precipitation),
      value: precipitation,
      ideal: '0 mm'
    },
    feelsLike: {
      score: calculateFeelsLikeScore(temp, feelsLike),
      impact: getFeelsLikeImpact(temp, feelsLike),
      value: feelsLike,
      actual: temp
    }
  }
}

// Individual factor scoring functions
function calculateTemperatureScore(temp) {
  const diff = Math.abs(temp - 21)
  if (diff <= 3) return 100
  if (diff <= 6) return 80
  if (diff <= 10) return 60
  if (diff <= 15) return 40
  return 20
}

function getTemperatureImpact(temp) {
  if (temp >= 18 && temp <= 24) return 'Optimal temperature for comfort'
  if (temp > 24 && temp <= 30) return 'Warm - may feel slightly uncomfortable'
  if (temp > 30) return 'Hot - uncomfortable for most people'
  if (temp < 18 && temp >= 10) return 'Cool - light jacket recommended'
  if (temp < 10) return 'Cold - warm clothing needed'
  return 'Moderate'
}

function calculateHumidityScore(humidity) {
  if (humidity >= 40 && humidity <= 60) return 100
  if (humidity >= 30 && humidity <= 70) return 80
  if (humidity >= 20 && humidity <= 80) return 60
  if (humidity >= 10 && humidity <= 90) return 40
  return 20
}

function getHumidityImpact(humidity) {
  if (humidity >= 40 && humidity <= 60) return 'Ideal humidity levels'
  if (humidity > 70) return 'High humidity - feels muggy and oppressive'
  if (humidity > 60) return 'Slightly humid - may feel warmer than actual temperature'
  if (humidity < 30) return 'Very dry - may cause skin and respiratory discomfort'
  if (humidity < 40) return 'Dry air - stay hydrated'
  return 'Moderate'
}

function calculateWindScore(windSpeed) {
  if (windSpeed <= 10) return 100
  if (windSpeed <= 20) return 80
  if (windSpeed <= 30) return 60
  if (windSpeed <= 40) return 40
  return 20
}

function getWindImpact(windSpeed) {
  if (windSpeed <= 10) return 'Calm to light breeze - pleasant conditions'
  if (windSpeed <= 20) return 'Moderate breeze - comfortable for most activities'
  if (windSpeed <= 30) return 'Fresh breeze - may affect some outdoor activities'
  if (windSpeed <= 40) return 'Strong breeze - difficult conditions for some activities'
  return 'Very strong winds - outdoor activities challenging'
}

function calculateUVScore(uvIndex) {
  if (uvIndex <= 2) return 100
  if (uvIndex <= 5) return 80
  if (uvIndex <= 7) return 60
  if (uvIndex <= 10) return 40
  return 20
}

function getUVImpact(uvIndex) {
  if (uvIndex <= 2) return 'Low UV - minimal sun protection needed'
  if (uvIndex <= 5) return 'Moderate UV - sun protection recommended'
  if (uvIndex <= 7) return 'High UV - sun protection essential'
  if (uvIndex <= 10) return 'Very high UV - extra precautions required'
  return 'Extreme UV - avoid sun exposure during midday'
}

function calculatePrecipitationScore(precipitation) {
  if (precipitation === 0) return 100
  if (precipitation <= 1) return 70
  if (precipitation <= 5) return 40
  return 20
}

function getPrecipitationImpact(precipitation) {
  if (precipitation === 0) return 'No precipitation - ideal conditions'
  if (precipitation <= 1) return 'Light precipitation - minor impact'
  if (precipitation <= 5) return 'Moderate precipitation - umbrella recommended'
  return 'Heavy precipitation - outdoor activities affected'
}

function calculateFeelsLikeScore(temp, feelsLike) {
  const diff = Math.abs(feelsLike - temp)
  if (diff <= 2) return 100
  if (diff <= 5) return 80
  if (diff <= 8) return 60
  return 40
}

function getFeelsLikeImpact(temp, feelsLike) {
  const diff = feelsLike - temp
  if (Math.abs(diff) <= 2) return 'Feels like actual temperature'
  if (diff > 0) return `Feels ${Math.abs(diff).toFixed(1)}°C warmer due to humidity`
  return `Feels ${Math.abs(diff).toFixed(1)}°C cooler due to wind chill`
}

/**
 * Find optimal time windows for outdoor activities
 */
function findOptimalWindows(hourlyComfort) {
  const windows = []
  let currentWindow = null

  for (let i = 0; i < hourlyComfort.length; i++) {
    const hour = hourlyComfort[i]
    
    if (hour.score >= 70) {
      // Start or extend window
      if (!currentWindow) {
        currentWindow = {
          start: hour.time,
          startHour: hour.hour,
          end: hour.time,
          endHour: hour.hour,
          avgScore: hour.score,
          count: 1
        }
      } else {
        currentWindow.end = hour.time
        currentWindow.endHour = hour.hour
        currentWindow.avgScore = (currentWindow.avgScore * currentWindow.count + hour.score) / (currentWindow.count + 1)
        currentWindow.count++
      }
    } else {
      // End current window if exists
      if (currentWindow && currentWindow.count >= 2) {
        windows.push({
          start: currentWindow.start,
          end: currentWindow.end,
          score: Math.round(currentWindow.avgScore),
          duration: currentWindow.count,
          activity: getRecommendedActivity(currentWindow.avgScore, currentWindow.startHour)
        })
      }
      currentWindow = null
    }
  }

  // Add last window if exists
  if (currentWindow && currentWindow.count >= 2) {
    windows.push({
      start: currentWindow.start,
      end: currentWindow.end,
      score: Math.round(currentWindow.avgScore),
      duration: currentWindow.count,
      activity: getRecommendedActivity(currentWindow.avgScore, currentWindow.startHour)
    })
  }

  return windows.slice(0, 3) // Return top 3 windows
}

/**
 * Get recommended activity based on comfort score and time
 */
function getRecommendedActivity(score, hour) {
  if (score >= 90) {
    if (hour >= 6 && hour <= 9) return 'Morning run or walk'
    if (hour >= 10 && hour <= 16) return 'Outdoor sports or picnic'
    if (hour >= 17 && hour <= 20) return 'Evening outdoor dining'
    return 'Outdoor activities'
  } else if (score >= 80) {
    if (hour >= 6 && hour <= 9) return 'Morning exercise'
    if (hour >= 10 && hour <= 16) return 'Outdoor activities with breaks'
    if (hour >= 17 && hour <= 20) return 'Evening walk'
    return 'Light outdoor activities'
  } else if (score >= 70) {
    return 'Short outdoor activities'
  }
  return 'Indoor activities recommended'
}

/**
 * Get comfort level description
 */
export function getComfortLevel(score) {
  if (score >= 90) return { level: 'Excellent', color: 'text-emerald-400', description: 'Perfect conditions for any outdoor activity' }
  if (score >= 80) return { level: 'Very Good', color: 'text-green-400', description: 'Great conditions for most outdoor activities' }
  if (score >= 70) return { level: 'Good', color: 'text-lime-400', description: 'Comfortable for outdoor activities' }
  if (score >= 60) return { level: 'Fair', color: 'text-yellow-400', description: 'Acceptable but not ideal conditions' }
  if (score >= 50) return { level: 'Moderate', color: 'text-orange-400', description: 'Some discomfort expected' }
  if (score >= 40) return { level: 'Poor', color: 'text-red-400', description: 'Uncomfortable conditions' }
  return { level: 'Very Poor', color: 'text-red-500', description: 'Very uncomfortable - avoid prolonged outdoor exposure' }
}

