/**
 * Weather Trend Analysis
 * Analyzes weather trends and provides comparative insights
 */

/**
 * Analyze weather trends
 * @param {Object} weatherData - Complete weather data from API
 * @param {string} location - Location name
 * @returns {Object} Trend analysis results
 */
export function analyzeWeatherTrends(weatherData, location) {
  if (!weatherData || !weatherData.daily || !weatherData.hourly) {
    return {
      weeklyComparison: {},
      insights: [],
      trends: []
    }
  }

  const { daily, hourly, current } = weatherData

  // Weekly comparison
  const weeklyComparison = calculateWeeklyComparison(daily)

  // Generate insights
  const insights = generateTrendInsights(daily, hourly, current, weeklyComparison)

  // Calculate specific trends
  const trends = calculateTrends(daily, hourly)

  return {
    weeklyComparison,
    insights,
    trends
  }
}

/**
 * Calculate weekly comparison metrics
 */
function calculateWeeklyComparison(daily) {
  const firstHalf = daily.temperature_2m_max.slice(0, 3)
  const secondHalf = daily.temperature_2m_max.slice(4, 7)
  
  const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
  
  const tempChange = secondHalfAvg - firstHalfAvg
  const tempDirection = tempChange > 0 ? 'warmer' : 'cooler'
  const tempPercentage = Math.abs((tempChange / firstHalfAvg) * 100)

  // Precipitation comparison
  const firstHalfPrecip = daily.precipitation_sum.slice(0, 3).reduce((a, b) => a + b, 0)
  const secondHalfPrecip = daily.precipitation_sum.slice(4, 7).reduce((a, b) => a + b, 0)
  
  const precipChange = secondHalfPrecip - firstHalfPrecip
  const precipDirection = precipChange > 0 ? 'wetter' : 'drier'
  const precipPercentage = firstHalfPrecip > 0 ? Math.abs((precipChange / firstHalfPrecip) * 100) : 0

  // Wind comparison
  const firstHalfWind = daily.wind_speed_10m_max.slice(0, 3).reduce((a, b) => a + b, 0) / 3
  const secondHalfWind = daily.wind_speed_10m_max.slice(4, 7).reduce((a, b) => a + b, 0) / 3
  
  const windChange = secondHalfWind - firstHalfWind
  const windDirection = windChange > 0 ? 'windier' : 'calmer'

  return {
    temperature: {
      change: tempChange,
      direction: tempDirection,
      percentage: tempPercentage,
      summary: `${Math.abs(tempChange).toFixed(1)}°C ${tempDirection}`
    },
    precipitation: {
      change: precipChange,
      direction: precipDirection,
      percentage: precipPercentage,
      summary: `${Math.abs(precipChange).toFixed(1)}mm ${precipDirection}`
    },
    wind: {
      change: windChange,
      direction: windDirection,
      summary: `${Math.abs(windChange).toFixed(1)} km/h ${windDirection}`
    }
  }
}

/**
 * Generate trend insights
 */
function generateTrendInsights(daily, hourly, current, weeklyComparison) {
  const insights = []

  // Temperature trend insight
  if (Math.abs(weeklyComparison.temperature.change) > 3) {
    insights.push({
      type: 'temperature',
      severity: Math.abs(weeklyComparison.temperature.change) > 5 ? 'high' : 'medium',
      icon: weeklyComparison.temperature.direction === 'warmer' ? 'TrendingUp' : 'TrendingDown',
      title: `Significant ${weeklyComparison.temperature.direction === 'warmer' ? 'Warming' : 'Cooling'} Trend`,
      description: `Temperature trending ${weeklyComparison.temperature.change.toFixed(1)}°C ${weeklyComparison.temperature.direction} over the week (${weeklyComparison.temperature.percentage.toFixed(0)}% change). ${weeklyComparison.temperature.direction === 'warmer' ? 'Prepare for warmer conditions' : 'Prepare for cooler conditions'}.`,
      value: weeklyComparison.temperature.change,
      unit: '°C'
    })
  }

  // Precipitation trend insight
  const totalPrecip = daily.precipitation_sum.reduce((a, b) => a + b, 0)
  if (totalPrecip > 10) {
    insights.push({
      type: 'precipitation',
      severity: totalPrecip > 30 ? 'high' : 'medium',
      icon: 'CloudRain',
      title: 'Wet Week Ahead',
      description: `Total precipitation forecast: ${totalPrecip.toFixed(1)}mm over the next 7 days. ${weeklyComparison.precipitation.direction === 'wetter' ? 'Conditions becoming wetter' : 'Conditions improving'}. Keep umbrella handy.`,
      value: totalPrecip,
      unit: 'mm'
    })
  } else if (totalPrecip < 1) {
    insights.push({
      type: 'precipitation',
      severity: 'low',
      icon: 'Sun',
      title: 'Dry Week Expected',
      description: `Very little precipitation forecast (${totalPrecip.toFixed(1)}mm total). Excellent for outdoor activities and events. Low humidity expected.`,
      value: totalPrecip,
      unit: 'mm'
    })
  }

  // UV trend insight
  const avgUV = daily.uv_index_max.reduce((a, b) => a + b, 0) / daily.uv_index_max.length
  if (avgUV > 6) {
    insights.push({
      type: 'uv',
      severity: avgUV > 8 ? 'high' : 'medium',
      icon: 'Sun',
      title: 'High UV Levels This Week',
      description: `Average UV index: ${avgUV.toFixed(1)} (High to Very High). Sun protection essential. Seek shade during peak hours (10 AM - 4 PM). Use SPF 30+ sunscreen.`,
      value: avgUV,
      unit: 'UV Index'
    })
  }

  // Wind trend insight
  const maxWind = Math.max(...daily.wind_speed_10m_max)
  if (maxWind > 40) {
    insights.push({
      type: 'wind',
      severity: maxWind > 60 ? 'high' : 'medium',
      icon: 'Wind',
      title: 'Strong Winds Expected',
      description: `Peak wind speeds forecast: ${maxWind.toFixed(0)} km/h. ${weeklyComparison.wind.direction === 'windier' ? 'Conditions becoming windier' : 'Winds moderating'}. Secure loose objects outdoors.`,
      value: maxWind,
      unit: 'km/h'
    })
  }

  // Temperature range insight
  const tempRange = Math.max(...daily.temperature_2m_max) - Math.min(...daily.temperature_2m_min)
  if (tempRange > 20) {
    insights.push({
      type: 'temperature',
      severity: 'medium',
      icon: 'Thermometer',
      title: 'Large Temperature Variations',
      description: `Temperature range: ${tempRange.toFixed(1)}°C across the week (${Math.min(...daily.temperature_2m_min).toFixed(1)}°C to ${Math.max(...daily.temperature_2m_max).toFixed(1)}°C). Dress in layers and be prepared for changing conditions.`,
      value: tempRange,
      unit: '°C range'
    })
  }

  // Stability insight
  const tempVariability = calculateVariability(daily.temperature_2m_max)
  if (tempVariability < 2) {
    insights.push({
      type: 'stability',
      severity: 'low',
      icon: 'Activity',
      title: 'Stable Weather Pattern',
      description: `Very consistent temperatures throughout the week (variability: ${tempVariability.toFixed(1)}°C). Stable high-pressure system likely. Reliable conditions for planning outdoor activities.`,
      value: tempVariability,
      unit: '°C variability'
    })
  } else if (tempVariability > 5) {
    insights.push({
      type: 'stability',
      severity: 'medium',
      icon: 'Zap',
      title: 'Unstable Weather Pattern',
      description: `Highly variable temperatures (variability: ${tempVariability.toFixed(1)}°C). Multiple weather systems passing through. Be prepared for changing conditions.`,
      value: tempVariability,
      unit: '°C variability'
    })
  }

  return insights
}

/**
 * Calculate specific trends
 */
function calculateTrends(daily, hourly) {
  const trends = []

  // Daily temperature trend
  const dailyTempTrend = calculateLinearTrend(daily.temperature_2m_max)
  trends.push({
    name: 'Temperature Trend',
    slope: dailyTempTrend.slope,
    direction: dailyTempTrend.slope > 0 ? 'increasing' : 'decreasing',
    strength: Math.abs(dailyTempTrend.slope) > 1 ? 'strong' : 'weak',
    description: `${Math.abs(dailyTempTrend.slope).toFixed(2)}°C per day ${dailyTempTrend.slope > 0 ? 'increase' : 'decrease'}`
  })

  // Precipitation probability trend
  const precipTrend = calculateLinearTrend(daily.precipitation_probability_max)
  trends.push({
    name: 'Precipitation Probability',
    slope: precipTrend.slope,
    direction: precipTrend.slope > 0 ? 'increasing' : 'decreasing',
    strength: Math.abs(precipTrend.slope) > 5 ? 'strong' : 'weak',
    description: `${Math.abs(precipTrend.slope).toFixed(1)}% per day ${precipTrend.slope > 0 ? 'increase' : 'decrease'}`
  })

  // Cloud cover trend
  const cloudTrend = calculateLinearTrend(daily.cloud_cover_mean || daily.precipitation_probability_max)
  trends.push({
    name: 'Cloud Cover',
    slope: cloudTrend.slope,
    direction: cloudTrend.slope > 0 ? 'increasing' : 'decreasing',
    strength: Math.abs(cloudTrend.slope) > 5 ? 'strong' : 'weak',
    description: `${cloudTrend.slope > 0 ? 'Becoming cloudier' : 'Clearing up'}`
  })

  return trends
}

/**
 * Calculate linear trend (simple regression)
 */
function calculateLinearTrend(data) {
  const n = data.length
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0

  for (let i = 0; i < n; i++) {
    sumX += i
    sumY += data[i]
    sumXY += i * data[i]
    sumXX += i * i
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept }
}

/**
 * Calculate variability (standard deviation)
 */
function calculateVariability(data) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const squaredDiffs = data.map(value => Math.pow(value - mean, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length
  return Math.sqrt(variance)
}

/**
 * Get historical comparison (simulated - in production, use actual historical data)
 */
export function getHistoricalComparison(current, daily) {
  const currentTemp = current.temperature_2m
  const avgTemp = daily.temperature_2m_max.reduce((a, b) => a + b, 0) / daily.temperature_2m_max.length
  
  // Simulate historical average (in production, fetch from historical API)
  const seasonalAverage = getSeasonalAverage(new Date().getMonth())
  const difference = avgTemp - seasonalAverage
  
  return {
    vsSeasonalAverage: {
      difference: difference,
      percentage: (difference / seasonalAverage) * 100,
      description: difference > 0 
        ? `${Math.abs(difference).toFixed(1)}°C above seasonal average`
        : `${Math.abs(difference).toFixed(1)}°C below seasonal average`
    },
    anomaly: Math.abs(difference) > 5 ? {
      severity: Math.abs(difference) > 10 ? 'extreme' : 'significant',
      description: Math.abs(difference) > 10 
        ? 'Extreme temperature anomaly detected'
        : 'Significant temperature deviation from normal'
    } : null
  }
}

/**
 * Get seasonal average temperature (simplified)
 */
function getSeasonalAverage(month) {
  // Northern hemisphere averages (simplified)
  const averages = {
    0: 5,   // January
    1: 6,   // February
    2: 9,   // March
    3: 12,  // April
    4: 16,  // May
    5: 19,  // June
    6: 21,  // July
    7: 21,  // August
    8: 18,  // September
    9: 14,  // October
    10: 9,  // November
    11: 6   // December
  }
  return averages[month] || 15
}

