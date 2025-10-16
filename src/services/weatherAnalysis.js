/**
 * Dynamic Weather Analysis Utilities
 * Analyzes weather data to provide contextual insights without hardcoding
 */

/**
 * Analyze hourly weather changes to detect rapid transitions
 */
export function analyzeHourlyTransitions(hourly, hoursToAnalyze = 12) {
  const transitions = []
  
  for (let i = 1; i < Math.min(hoursToAnalyze, hourly.time.length); i++) {
    const tempDiff = hourly.temperature_2m[i] - hourly.temperature_2m[i - 1]
    const precipDiff = hourly.precipitation_probability[i] - hourly.precipitation_probability[i - 1]
    const windDiff = hourly.wind_speed_10m[i] - hourly.wind_speed_10m[i - 1]
    const cloudDiff = hourly.cloud_cover[i] - hourly.cloud_cover[i - 1]
    
    const transition = {
      hour: i,
      time: new Date(hourly.time[i]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tempChange: tempDiff,
      precipChange: precipDiff,
      windChange: windDiff,
      cloudChange: cloudDiff,
      significance: 0
    }
    
    // Calculate significance score
    if (Math.abs(tempDiff) > 3) transition.significance += Math.abs(tempDiff) * 2
    if (Math.abs(precipDiff) > 20) transition.significance += Math.abs(precipDiff)
    if (Math.abs(windDiff) > 10) transition.significance += Math.abs(windDiff)
    if (Math.abs(cloudDiff) > 30) transition.significance += Math.abs(cloudDiff) / 2
    
    if (transition.significance > 10) {
      transitions.push(transition)
    }
  }
  
  return transitions.sort((a, b) => b.significance - a.significance).slice(0, 5)
}

/**
 * Generate dynamic clothing recommendations based on weather patterns
 */
export function generateClothingRecommendations(current, hourly) {
  const recommendations = []
  const next12Hours = hourly.temperature_2m.slice(0, 12)
  const next12HoursPrecip = hourly.precipitation_probability.slice(0, 12)
  
  const minTemp = Math.min(...next12Hours)
  const maxTemp = Math.max(...next12Hours)
  const tempRange = maxTemp - minTemp
  const maxPrecip = Math.max(...next12HoursPrecip)
  
  // Dynamic temperature-based recommendations
  if (tempRange > 8) {
    recommendations.push({
      icon: '🧥',
      item: 'Layered clothing',
      reason: `Temperature will swing ${tempRange.toFixed(1)}°C (${minTemp.toFixed(0)}° to ${maxTemp.toFixed(0)}°C)`
    })
  }
  
  if (minTemp < 15) {
    recommendations.push({
      icon: '🧣',
      item: 'Jacket or sweater',
      reason: `Temperature drops to ${minTemp.toFixed(0)}°C`
    })
  }
  
  if (maxPrecip > 30) {
    recommendations.push({
      icon: '☂️',
      item: 'Umbrella',
      reason: `${maxPrecip}% chance of rain`
    })
  }
  
  if (current.uv_index > 3) {
    recommendations.push({
      icon: '🕶️',
      item: 'Sunscreen & sunglasses',
      reason: `UV index: ${current.uv_index.toFixed(1)}`
    })
  }
  
  if (current.wind_speed_10m > 25 || Math.max(...hourly.wind_speed_10m.slice(0, 12)) > 25) {
    recommendations.push({
      icon: '🧢',
      item: 'Secure hat/cap',
      reason: `Strong winds up to ${Math.max(current.wind_speed_10m, ...hourly.wind_speed_10m.slice(0, 12)).toFixed(0)} km/h`
    })
  }
  
  return recommendations
}

/**
 * Find optimal time windows for outdoor activities
 */
export function findOptimalTimeWindows(hourly, hoursToAnalyze = 12) {
  const windows = []
  let currentWindow = null
  
  for (let i = 0; i < Math.min(hoursToAnalyze, hourly.time.length); i++) {
    const temp = hourly.temperature_2m[i]
    const precip = hourly.precipitation_probability[i]
    const wind = hourly.wind_speed_10m[i]
    const cloud = hourly.cloud_cover[i]
    
    // Calculate comfort score (0-100)
    let score = 100
    if (temp < 10 || temp > 30) score -= Math.abs(temp - 20) * 2
    score -= precip * 0.8
    score -= Math.max(0, (wind - 20) * 2)
    score -= (cloud - 50) * 0.3
    
    const isGood = score > 60 && precip < 30
    
    if (isGood) {
      if (!currentWindow) {
        currentWindow = {
          start: i,
          startTime: new Date(hourly.time[i]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          score: score
        }
      }
    } else {
      if (currentWindow) {
        currentWindow.end = i - 1
        currentWindow.endTime = new Date(hourly.time[i - 1]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        currentWindow.duration = currentWindow.end - currentWindow.start + 1
        if (currentWindow.duration >= 2) {
          windows.push(currentWindow)
        }
        currentWindow = null
      }
    }
  }
  
  // Close last window if still open
  if (currentWindow) {
    currentWindow.end = Math.min(hoursToAnalyze, hourly.time.length) - 1
    currentWindow.endTime = new Date(hourly.time[currentWindow.end]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    currentWindow.duration = currentWindow.end - currentWindow.start + 1
    if (currentWindow.duration >= 2) {
      windows.push(currentWindow)
    }
  }
  
  return windows.sort((a, b) => b.score - a.score).slice(0, 3)
}

/**
 * Analyze weather volatility to determine unpredictability level
 */
export function analyzeWeatherVolatility(hourly, hoursToAnalyze = 24) {
  const temps = hourly.temperature_2m.slice(0, hoursToAnalyze)
  const precips = hourly.precipitation_probability.slice(0, hoursToAnalyze)
  const winds = hourly.wind_speed_10m.slice(0, hoursToAnalyze)
  
  // Calculate standard deviation for each metric
  const tempStdDev = calculateStdDev(temps)
  const precipStdDev = calculateStdDev(precips)
  const windStdDev = calculateStdDev(winds)
  
  // Calculate volatility score
  const volatilityScore = (tempStdDev * 2) + (precipStdDev * 0.5) + (windStdDev * 1.5)
  
  let volatilityLevel = 'stable'
  let description = 'Weather conditions are relatively stable'
  
  if (volatilityScore > 50) {
    volatilityLevel = 'highly_volatile'
    description = 'Expect significant weather changes throughout the day'
  } else if (volatilityScore > 30) {
    volatilityLevel = 'moderate'
    description = 'Some weather variations expected'
  }
  
  return {
    score: volatilityScore,
    level: volatilityLevel,
    description,
    tempVariability: tempStdDev,
    precipVariability: precipStdDev,
    windVariability: windStdDev
  }
}

/**
 * Generate hour-by-hour condition summary
 */
export function generateHourlyConditionSummary(hourly, hoursToShow = 12) {
  return hourly.time.slice(0, hoursToShow).map((time, i) => ({
    time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    hour: new Date(time).getHours(),
    temp: hourly.temperature_2m[i],
    feelsLike: hourly.apparent_temperature[i],
    precip: hourly.precipitation_probability[i],
    wind: hourly.wind_speed_10m[i],
    cloud: hourly.cloud_cover[i],
    weatherCode: hourly.weather_code[i],
    uv: hourly.uv_index ? hourly.uv_index[i] : 0
  }))
}

/**
 * Helper: Calculate standard deviation
 */
function calculateStdDev(values) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
  return Math.sqrt(variance)
}

/**
 * Generate dynamic weather insights based on data patterns
 */
export function generateDynamicInsights(current, hourly, daily) {
  const insights = []
  const volatility = analyzeWeatherVolatility(hourly)
  const transitions = analyzeHourlyTransitions(hourly)
  const windows = findOptimalTimeWindows(hourly)
  
  // Volatility insight
  if (volatility.level === 'highly_volatile') {
    insights.push({
      type: 'volatility',
      priority: 'high',
      message: `${volatility.description}. Temperature variability: ${volatility.tempVariability.toFixed(1)}°C, prepare for changing conditions.`
    })
  }
  
  // Transition insights
  if (transitions.length > 0) {
    const topTransition = transitions[0]
    let changeDesc = []
    if (Math.abs(topTransition.tempChange) > 3) {
      changeDesc.push(`${topTransition.tempChange > 0 ? 'warming' : 'cooling'} by ${Math.abs(topTransition.tempChange).toFixed(1)}°C`)
    }
    if (Math.abs(topTransition.precipChange) > 20) {
      changeDesc.push(`${topTransition.precipChange > 0 ? 'rain likely' : 'clearing'}`)
    }
    
    if (changeDesc.length > 0) {
      insights.push({
        type: 'transition',
        priority: 'high',
        message: `Major change at ${topTransition.time}: ${changeDesc.join(', ')}`
      })
    }
  }
  
  // Optimal window insight
  if (windows.length > 0) {
    insights.push({
      type: 'opportunity',
      priority: 'medium',
      message: `Best outdoor window: ${windows[0].startTime} - ${windows[0].endTime} (${windows[0].duration} hours)`
    })
  }
  
  return insights
}

