/**
 * Weather Pattern Recognition & Prediction
 * Analyzes historical and current weather data to identify patterns and make predictions
 */

/**
 * Analyze weather patterns and generate insights
 * @param {Object} weatherData - Complete weather data from API
 * @param {string} location - Location name
 * @returns {Object} Pattern analysis results
 */
export function analyzeWeatherPatterns(weatherData, location) {
  if (!weatherData || !weatherData.hourly || !weatherData.daily) {
    return { patterns: [] }
  }

  const patterns = []
  const { current, hourly, daily } = weatherData

  // Pattern 1: Recurring precipitation pattern
  const precipPattern = detectPrecipitationPattern(hourly, daily)
  if (precipPattern) patterns.push(precipPattern)

  // Pattern 2: Temperature trend pattern
  const tempPattern = detectTemperatureTrend(hourly, daily)
  if (tempPattern) patterns.push(tempPattern)

  // Pattern 3: Pressure system pattern
  const pressurePattern = detectPressurePattern(current, hourly)
  if (pressurePattern) patterns.push(pressurePattern)

  // Pattern 4: Humidity pattern
  const humidityPattern = detectHumidityPattern(hourly, daily)
  if (humidityPattern) patterns.push(humidityPattern)

  // Pattern 5: Wind pattern
  const windPattern = detectWindPattern(hourly)
  if (windPattern) patterns.push(windPattern)

  // Pattern 6: Anomaly detection
  const anomalies = detectAnomalies(current, daily)
  patterns.push(...anomalies)

  return { patterns }
}

/**
 * Detect precipitation patterns
 */
function detectPrecipitationPattern(hourly, daily) {
  const precipProbs = hourly.precipitation_probability.slice(0, 48)
  const highPrecipHours = precipProbs.filter(p => p > 60).length
  
  if (highPrecipHours > 12) {
    // Extended wet period
    const avgProb = precipProbs.reduce((a, b) => a + b, 0) / precipProbs.length
    return {
      type: 'recurring',
      confidence: Math.min(95, Math.round(avgProb)),
      title: 'Extended Wet Period Detected',
      description: `Weather models show sustained precipitation probability averaging ${avgProb.toFixed(0)}% over the next 48 hours. This pattern suggests a slow-moving weather system or frontal boundary.`,
      icon: 'CloudRain',
      timeframe: 'Next 48 hours'
    }
  } else if (highPrecipHours > 6) {
    return {
      type: 'recurring',
      confidence: 75,
      title: 'Intermittent Rain Pattern',
      description: `Scattered showers expected with ${highPrecipHours} hours of elevated precipitation probability. Typical of unstable atmospheric conditions.`,
      icon: 'CloudDrizzle',
      timeframe: 'Next 24-48 hours'
    }
  }
  
  return null
}

/**
 * Detect temperature trend patterns
 */
function detectTemperatureTrend(hourly, daily) {
  const temps = hourly.temperature_2m.slice(0, 48)
  const dailyTemps = daily.temperature_2m_max.slice(0, 7)
  
  // Calculate trend
  let risingCount = 0
  let fallingCount = 0
  
  for (let i = 1; i < dailyTemps.length; i++) {
    if (dailyTemps[i] > dailyTemps[i - 1]) risingCount++
    else if (dailyTemps[i] < dailyTemps[i - 1]) fallingCount++
  }
  
  if (risingCount >= 4) {
    const avgIncrease = (dailyTemps[dailyTemps.length - 1] - dailyTemps[0]) / dailyTemps.length
    return {
      type: 'prediction',
      confidence: 85,
      title: 'Warming Trend Identified',
      description: `Temperature analysis shows consistent warming over the next 7 days, averaging +${avgIncrease.toFixed(1)}°C per day. This indicates a high-pressure system or warm air mass moving into the region.`,
      icon: 'TrendingUp',
      timeframe: 'Next 7 days'
    }
  } else if (fallingCount >= 4) {
    const avgDecrease = (dailyTemps[0] - dailyTemps[dailyTemps.length - 1]) / dailyTemps.length
    return {
      type: 'prediction',
      confidence: 85,
      title: 'Cooling Trend Identified',
      description: `Temperature forecast shows consistent cooling over the next 7 days, averaging -${avgDecrease.toFixed(1)}°C per day. Cold front or polar air mass approaching.`,
      icon: 'TrendingDown',
      timeframe: 'Next 7 days'
    }
  }
  
  // Check for rapid temperature swings
  const maxSwing = Math.max(...temps) - Math.min(...temps)
  if (maxSwing > 15) {
    return {
      type: 'anomaly',
      confidence: 90,
      title: 'High Temperature Volatility',
      description: `Expect significant temperature fluctuations of up to ${maxSwing.toFixed(1)}°C over the next 48 hours. This indicates transitional weather with competing air masses.`,
      icon: 'Zap',
      timeframe: 'Next 48 hours'
    }
  }
  
  return null
}

/**
 * Detect pressure system patterns
 */
function detectPressurePattern(current, hourly) {
  const currentPressure = current.pressure_msl
  const pressures = hourly.pressure_msl.slice(0, 24)
  
  // Calculate pressure trend
  const pressureChange = pressures[pressures.length - 1] - currentPressure
  const changeRate = pressureChange / 24 // hPa per hour
  
  if (currentPressure > 1020) {
    return {
      type: 'recurring',
      confidence: 88,
      title: 'High Pressure System Dominant',
      description: `Atmospheric pressure at ${currentPressure.toFixed(0)} hPa indicates a strong high-pressure system. Expect generally stable, clear conditions with light winds. Good weather for outdoor activities.`,
      icon: 'Sun',
      timeframe: 'Current'
    }
  } else if (currentPressure < 1000) {
    return {
      type: 'recurring',
      confidence: 88,
      title: 'Low Pressure System Active',
      description: `Atmospheric pressure at ${currentPressure.toFixed(0)} hPa indicates a low-pressure system. Associated with unsettled weather, increased cloudiness, and higher precipitation probability.`,
      icon: 'Cloud',
      timeframe: 'Current'
    }
  } else if (Math.abs(changeRate) > 0.5) {
    const direction = changeRate > 0 ? 'rising' : 'falling'
    const implication = changeRate > 0 ? 'improving weather conditions' : 'deteriorating weather conditions'
    return {
      type: 'prediction',
      confidence: 82,
      title: `Rapidly ${direction.charAt(0).toUpperCase() + direction.slice(1)} Pressure`,
      description: `Pressure ${direction} at ${Math.abs(changeRate).toFixed(1)} hPa/hour over the next 24 hours, suggesting ${implication}. Monitor for weather changes.`,
      icon: 'Activity',
      timeframe: 'Next 24 hours'
    }
  }
  
  return null
}

/**
 * Detect humidity patterns
 */
function detectHumidityPattern(hourly, daily) {
  const humidity = hourly.relative_humidity_2m.slice(0, 24)
  const avgHumidity = humidity.reduce((a, b) => a + b, 0) / humidity.length
  
  if (avgHumidity > 85) {
    return {
      type: 'recurring',
      confidence: 90,
      title: 'Persistent High Humidity',
      description: `Humidity levels averaging ${avgHumidity.toFixed(0)}% over the next 24 hours. Saturated air mass present, increasing heat index and potential for fog or mist formation.`,
      icon: 'Droplets',
      timeframe: 'Next 24 hours'
    }
  } else if (avgHumidity < 30) {
    return {
      type: 'recurring',
      confidence: 85,
      title: 'Very Dry Air Mass',
      description: `Humidity levels averaging ${avgHumidity.toFixed(0)}% indicate very dry conditions. Increased fire risk, static electricity, and potential respiratory discomfort.`,
      icon: 'Wind',
      timeframe: 'Next 24 hours'
    }
  }
  
  return null
}

/**
 * Detect wind patterns
 */
function detectWindPattern(hourly) {
  const windSpeeds = hourly.wind_speed_10m.slice(0, 24)
  const avgWind = windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length
  const maxWind = Math.max(...windSpeeds)
  const gustSpeeds = hourly.wind_gusts_10m.slice(0, 24)
  const maxGust = Math.max(...gustSpeeds)
  
  if (maxGust > 60) {
    return {
      type: 'anomaly',
      confidence: 95,
      title: 'Severe Wind Event Expected',
      description: `Wind gusts forecast to reach ${maxGust.toFixed(0)} km/h. Strong pressure gradients driving intense air movement. Secure loose objects, avoid exposed areas.`,
      icon: 'Wind',
      timeframe: 'Next 24 hours'
    }
  } else if (avgWind > 30) {
    return {
      type: 'recurring',
      confidence: 85,
      title: 'Sustained Strong Winds',
      description: `Average wind speeds of ${avgWind.toFixed(0)} km/h expected. Persistent strong winds suggest active weather system or topographic wind channeling.`,
      icon: 'Wind',
      timeframe: 'Next 24 hours'
    }
  }
  
  return null
}

/**
 * Detect weather anomalies
 */
function detectAnomalies(current, daily) {
  const anomalies = []
  
  // UV Index anomaly
  const maxUV = daily.uv_index_max[0]
  if (maxUV >= 8) {
    anomalies.push({
      type: 'anomaly',
      confidence: 95,
      title: 'Very High UV Index Alert',
      description: `UV index forecast at ${maxUV.toFixed(1)} (Very High/Extreme). Ozone layer thinning or high solar angle. Skin damage can occur in less than 15 minutes. Use SPF 30+ sunscreen.`,
      icon: 'Sun',
      timeframe: 'Today'
    })
  }
  
  // Temperature extremes
  const maxTemp = daily.temperature_2m_max[0]
  const minTemp = daily.temperature_2m_min[0]
  
  if (maxTemp >= 35) {
    anomalies.push({
      type: 'anomaly',
      confidence: 92,
      title: 'Heat Wave Conditions',
      description: `Temperature reaching ${maxTemp.toFixed(1)}°C. Extreme heat event. High risk of heat exhaustion and heat stroke. Stay hydrated, seek air conditioning.`,
      icon: 'Thermometer',
      timeframe: 'Today'
    })
  } else if (minTemp <= 0) {
    anomalies.push({
      type: 'anomaly',
      confidence: 92,
      title: 'Freezing Conditions Expected',
      description: `Temperature dropping to ${minTemp.toFixed(1)}°C. Below freezing point. Risk of ice formation on roads and surfaces. Protect sensitive plants and pipes.`,
      icon: 'Snowflake',
      timeframe: 'Today'
    })
  }
  
  return anomalies
}

