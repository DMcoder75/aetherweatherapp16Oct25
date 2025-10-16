/**
 * Weather Impact Forecasting
 * Predicts weather impacts on various aspects of daily life
 */

/**
 * Forecast weather impacts
 * @param {Object} weatherData - Complete weather data from API
 * @param {string} location - Location name
 * @returns {Object} Impact forecast results
 */
export function forecastWeatherImpacts(weatherData, location) {
  if (!weatherData || !weatherData.current || !weatherData.daily) {
    return { impacts: [] }
  }

  const { current, daily, hourly } = weatherData
  const impacts = []

  // Transportation impacts
  const transportImpacts = analyzeTransportationImpacts(current, daily, hourly)
  impacts.push(...transportImpacts)

  // Health impacts
  const healthImpacts = analyzeHealthImpacts(current, daily)
  impacts.push(...healthImpacts)

  // Outdoor activity impacts
  const outdoorImpacts = analyzeOutdoorActivityImpacts(current, daily, hourly)
  impacts.push(...outdoorImpacts)

  // Energy impacts
  const energyImpacts = analyzeEnergyImpacts(current, daily)
  impacts.push(...energyImpacts)

  return { impacts }
}

/**
 * Analyze transportation impacts
 */
function analyzeTransportationImpacts(current, daily, hourly) {
  const impacts = []
  
  // Precipitation impact on traffic
  const precipSum = daily.precipitation_sum.slice(0, 2).reduce((a, b) => a + b, 0)
  const maxPrecipProb = Math.max(...hourly.precipitation_probability.slice(0, 24))
  
  if (precipSum > 10 || maxPrecipProb > 70) {
    impacts.push({
      category: 'transportation',
      severity: precipSum > 20 ? 'high' : 'medium',
      icon: 'Car',
      title: 'Traffic Delays Expected',
      description: `Heavy precipitation forecast (${precipSum.toFixed(1)}mm) will likely cause traffic congestion and reduced visibility. Allow extra travel time.`,
      recommendations: [
        'Allow 20-30% extra travel time',
        'Use headlights and reduce speed',
        'Check traffic conditions before departure',
        'Consider public transportation'
      ],
      timeframe: 'Next 24-48 hours',
      probability: maxPrecipProb
    })
  }

  // Wind impact on transportation
  const maxWind = Math.max(...daily.wind_speed_10m_max.slice(0, 2))
  const maxGusts = Math.max(...hourly.wind_gusts_10m.slice(0, 24))
  
  if (maxGusts > 60) {
    impacts.push({
      category: 'transportation',
      severity: 'high',
      icon: 'Wind',
      title: 'High Winds Affecting Travel',
      description: `Wind gusts up to ${maxGusts.toFixed(0)} km/h expected. High-profile vehicles at risk. Possible flight delays and bridge closures.`,
      recommendations: [
        'Avoid driving high-profile vehicles',
        'Check flight status before heading to airport',
        'Secure cargo and roof racks',
        'Be cautious on bridges and open roads'
      ],
      timeframe: 'Next 24 hours',
      probability: 85
    })
  } else if (maxWind > 40) {
    impacts.push({
      category: 'transportation',
      severity: 'medium',
      icon: 'Wind',
      title: 'Moderate Wind Impact on Travel',
      description: `Strong winds (${maxWind.toFixed(0)} km/h) may affect driving conditions, especially for high-sided vehicles.`,
      recommendations: [
        'Drive cautiously, especially on exposed routes',
        'Maintain firm grip on steering wheel',
        'Watch for debris on roads'
      ],
      timeframe: 'Next 24-48 hours',
      probability: 75
    })
  }

  // Temperature impact (ice/heat)
  const minTemp = Math.min(...daily.temperature_2m_min.slice(0, 2))
  const maxTemp = Math.max(...daily.temperature_2m_max.slice(0, 2))
  
  if (minTemp <= 0) {
    impacts.push({
      category: 'transportation',
      severity: 'high',
      icon: 'Snowflake',
      title: 'Ice Hazard on Roads',
      description: `Temperatures dropping to ${minTemp.toFixed(1)}°C. Ice formation likely on roads, bridges, and walkways.`,
      recommendations: [
        'Drive slowly and increase following distance',
        'Avoid sudden braking or acceleration',
        'Watch for black ice on bridges',
        'Keep emergency kit in vehicle'
      ],
      timeframe: 'Overnight and early morning',
      probability: 90
    })
  }

  return impacts
}

/**
 * Analyze health impacts
 */
function analyzeHealthImpacts(current, daily) {
  const impacts = []
  
  // UV health impact
  const maxUV = Math.max(...daily.uv_index_max.slice(0, 3))
  
  if (maxUV >= 8) {
    impacts.push({
      category: 'health',
      severity: 'high',
      icon: 'Sun',
      title: 'Extreme UV Radiation Risk',
      description: `UV index reaching ${maxUV.toFixed(1)} (Extreme). Unprotected skin can burn in less than 15 minutes.`,
      recommendations: [
        'Apply SPF 30+ sunscreen every 2 hours',
        'Wear protective clothing and wide-brimmed hat',
        'Seek shade between 10 AM and 4 PM',
        'Wear UV-blocking sunglasses'
      ],
      timeframe: 'Next 3 days',
      probability: 95
    })
  } else if (maxUV >= 6) {
    impacts.push({
      category: 'health',
      severity: 'medium',
      icon: 'Sun',
      title: 'High UV Exposure',
      description: `UV index ${maxUV.toFixed(1)} (High). Sun protection recommended for outdoor activities.`,
      recommendations: [
        'Use SPF 30+ sunscreen',
        'Wear hat and sunglasses',
        'Limit midday sun exposure'
      ],
      timeframe: 'Next 3 days',
      probability: 85
    })
  }

  // Heat stress
  const maxTemp = Math.max(...daily.temperature_2m_max.slice(0, 3))
  
  if (maxTemp >= 35) {
    impacts.push({
      category: 'health',
      severity: 'high',
      icon: 'Thermometer',
      title: 'Heat Stress Warning',
      description: `Extreme heat (${maxTemp.toFixed(1)}°C) poses serious health risks. Heat exhaustion and heat stroke possible.`,
      recommendations: [
        'Stay hydrated - drink water regularly',
        'Avoid strenuous outdoor activities',
        'Stay in air-conditioned spaces',
        'Check on elderly and vulnerable persons',
        'Never leave children or pets in vehicles'
      ],
      timeframe: 'Next 3 days',
      probability: 90
    })
  } else if (maxTemp >= 30) {
    impacts.push({
      category: 'health',
      severity: 'medium',
      icon: 'Thermometer',
      title: 'Heat Advisory',
      description: `High temperatures (${maxTemp.toFixed(1)}°C) may cause discomfort and mild heat-related illness.`,
      recommendations: [
        'Drink plenty of water',
        'Take breaks in shade or air conditioning',
        'Avoid peak heat hours (12 PM - 4 PM)'
      ],
      timeframe: 'Next 3 days',
      probability: 80
    })
  }

  // Cold stress
  const minTemp = Math.min(...daily.temperature_2m_min.slice(0, 3))
  
  if (minTemp <= -5) {
    impacts.push({
      category: 'health',
      severity: 'high',
      icon: 'Snowflake',
      title: 'Severe Cold Warning',
      description: `Extreme cold (${minTemp.toFixed(1)}°C) poses risk of frostbite and hypothermia.`,
      recommendations: [
        'Dress in multiple layers',
        'Cover all exposed skin',
        'Limit time outdoors',
        'Watch for signs of frostbite (numbness, white skin)'
      ],
      timeframe: 'Next 3 days',
      probability: 90
    })
  }

  // Air quality (humidity-based proxy)
  const avgHumidity = daily.relative_humidity_2m_max.slice(0, 3).reduce((a, b) => a + b, 0) / 3
  
  if (avgHumidity > 85) {
    impacts.push({
      category: 'health',
      severity: 'medium',
      icon: 'Droplets',
      title: 'High Humidity Health Impact',
      description: `Very high humidity (${avgHumidity.toFixed(0)}%) may trigger respiratory issues and increase heat stress.`,
      recommendations: [
        'Stay in air-conditioned spaces if possible',
        'Use dehumidifiers indoors',
        'Asthma sufferers should have medication ready',
        'Avoid strenuous outdoor activities'
      ],
      timeframe: 'Next 3 days',
      probability: 75
    })
  }

  return impacts
}

/**
 * Analyze outdoor activity impacts
 */
function analyzeOutdoorActivityImpacts(current, daily, hourly) {
  const impacts = []
  
  // General outdoor conditions
  const precipSum = daily.precipitation_sum.slice(0, 2).reduce((a, b) => a + b, 0)
  const maxWind = Math.max(...daily.wind_speed_10m_max.slice(0, 2))
  const avgTemp = daily.temperature_2m_max.slice(0, 2).reduce((a, b) => a + b, 0) / 2
  
  if (precipSum < 2 && maxWind < 20 && avgTemp >= 15 && avgTemp <= 25) {
    impacts.push({
      category: 'outdoor',
      severity: 'low',
      icon: 'Smile',
      title: 'Excellent Outdoor Conditions',
      description: 'Perfect weather for outdoor activities, events, and recreation. Make the most of these ideal conditions!',
      recommendations: [
        'Great time for outdoor sports and exercise',
        'Ideal for picnics and outdoor dining',
        'Perfect for photography and sightseeing',
        'Excellent for gardening and yard work'
      ],
      timeframe: 'Next 48 hours',
      probability: 95
    })
  } else if (precipSum > 15) {
    impacts.push({
      category: 'outdoor',
      severity: 'high',
      icon: 'CloudRain',
      title: 'Outdoor Activities Severely Impacted',
      description: `Heavy precipitation (${precipSum.toFixed(1)}mm) will significantly affect outdoor plans. Consider indoor alternatives.`,
      recommendations: [
        'Postpone outdoor events if possible',
        'Have backup indoor plans ready',
        'Waterproof gear essential if going out',
        'Watch for flooding in low-lying areas'
      ],
      timeframe: 'Next 48 hours',
      probability: 85
    })
  } else if (precipSum > 5) {
    impacts.push({
      category: 'outdoor',
      severity: 'medium',
      icon: 'CloudDrizzle',
      title: 'Outdoor Activities Affected',
      description: `Moderate precipitation (${precipSum.toFixed(1)}mm) expected. Outdoor activities possible with proper preparation.`,
      recommendations: [
        'Bring waterproof clothing',
        'Have contingency plans',
        'Check weather updates regularly'
      ],
      timeframe: 'Next 48 hours',
      probability: 70
    })
  }

  // Sports-specific impacts
  if (maxWind > 30) {
    impacts.push({
      category: 'outdoor',
      severity: 'medium',
      icon: 'Wind',
      title: 'Wind Impact on Outdoor Sports',
      description: `Strong winds (${maxWind.toFixed(0)} km/h) will affect ball sports, cycling, and water activities.`,
      recommendations: [
        'Avoid water sports and sailing',
        'Cycling will be challenging',
        'Ball sports (golf, tennis) affected',
        'Consider indoor alternatives'
      ],
      timeframe: 'Next 48 hours',
      probability: 80
    })
  }

  return impacts
}

/**
 * Analyze energy impacts
 */
function analyzeEnergyImpacts(current, daily) {
  const impacts = []
  
  const maxTemp = Math.max(...daily.temperature_2m_max.slice(0, 3))
  const minTemp = Math.min(...daily.temperature_2m_min.slice(0, 3))
  
  // Cooling energy demand
  if (maxTemp >= 30) {
    const demandIncrease = Math.min(50, (maxTemp - 25) * 5)
    impacts.push({
      category: 'energy',
      severity: maxTemp >= 35 ? 'high' : 'medium',
      icon: 'Zap',
      title: 'High Cooling Energy Demand',
      description: `Hot weather (${maxTemp.toFixed(1)}°C) will significantly increase air conditioning usage and electricity costs.`,
      recommendations: [
        `Expect ~${demandIncrease.toFixed(0)}% increase in cooling costs`,
        'Use programmable thermostat efficiently',
        'Close blinds during peak sun hours',
        'Run major appliances during off-peak hours',
        'Consider pre-cooling home before peak rates'
      ],
      timeframe: 'Next 3 days',
      probability: 85
    })
  }

  // Heating energy demand
  if (minTemp <= 5) {
    const demandIncrease = Math.min(50, (10 - minTemp) * 5)
    impacts.push({
      category: 'energy',
      severity: minTemp <= 0 ? 'high' : 'medium',
      icon: 'Flame',
      title: 'High Heating Energy Demand',
      description: `Cold weather (${minTemp.toFixed(1)}°C) will increase heating costs significantly.`,
      recommendations: [
        `Expect ~${demandIncrease.toFixed(0)}% increase in heating costs`,
        'Seal windows and doors to prevent drafts',
        'Use programmable thermostat to reduce nighttime heating',
        'Dress warmly indoors to lower thermostat setting',
        'Check heating system efficiency'
      ],
      timeframe: 'Next 3 days',
      probability: 85
    })
  }

  return impacts
}

/**
 * Get impact severity color
 */
export function getImpactSeverityColor(severity) {
  switch (severity) {
    case 'high':
      return 'border-red-500/50 bg-red-950/20'
    case 'medium':
      return 'border-yellow-500/50 bg-yellow-950/20'
    case 'low':
      return 'border-green-500/50 bg-green-950/20'
    default:
      return 'border-primary/30 bg-card/50'
  }
}

/**
 * Get impact severity badge color
 */
export function getImpactSeverityBadge(severity) {
  switch (severity) {
    case 'high':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'low':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    default:
      return 'bg-primary/20 text-primary border-primary/30'
  }
}

