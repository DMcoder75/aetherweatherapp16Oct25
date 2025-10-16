import { dalsiaiGenerateText } from './dalsiApi.js'

/**
 * Generate AI-enhanced analysis for pressure systems
 */
export async function generatePressureAnalysis(pressureData, weatherData) {
  const prompt = `As a professional meteorologist, analyze this atmospheric pressure data and provide expert insights:

Current Pressure: ${pressureData.current.toFixed(1)} hPa
Trend: ${pressureData.trend}
Temperature: ${weatherData.current.temperature_2m}°C
Wind Speed: ${weatherData.current.wind_speed_10m} km/h
Humidity: ${weatherData.current.relative_humidity_2m}%

Provide a detailed analysis covering:
1. What type of pressure system is present (High/Low/Ridge/Trough)
2. Expected weather behavior based on this pressure pattern
3. How the pressure system is interacting with temperature and wind
4. Short-term forecast implications (next 12-24 hours)
5. Any notable atmospheric phenomena to watch for

Keep the response concise but technically accurate (3-4 sentences).`

  try {
    const result = await dalsiaiGenerateText(prompt, 300)
    if (!result || !result.response) {
      console.warn('No response from AI for pressure analysis')
      return null
    }
    return result.response
  } catch (error) {
    console.error('Error generating pressure analysis:', error)
    return null
  }
}

/**
 * Generate AI-enhanced analysis for wind patterns
 */
export async function generateWindAnalysis(windData, weatherData) {
  const prompt = `As a meteorologist, analyze this wind pattern data:

Current Wind Speed: ${windData.current.toFixed(1)} km/h
Wind Direction: ${windData.direction}° (${getWindDirection(windData.direction)})
Wind Gusts: ${windData.gusts.toFixed(1)} km/h
Average Wind: ${windData.avg.toFixed(1)} km/h
Pressure: ${weatherData.current.pressure_msl} hPa

Analyze:
1. Wind pattern characteristics and what's driving this air movement
2. Relationship between wind direction and local pressure gradients
3. Significance of gust patterns and turbulence indicators
4. Impact on local weather conditions
5. Expected wind behavior in next 6-12 hours

Provide expert meteorological insights in 3-4 sentences.`

  try {
    const result = await dalsiaiGenerateText(prompt, 300)
    if (!result || !result.response) {
      console.warn('No response from AI for wind analysis')
      return null
    }
    return result.response
  } catch (error) {
    console.error('Error generating wind analysis:', error)
    return null
  }
}

/**
 * Generate AI-enhanced analysis for temperature patterns
 */
export async function generateTemperatureAnalysis(tempData, weatherData) {
  const prompt = `Analyze this temperature data as a meteorologist:

Current: ${tempData.current.toFixed(1)}°C
Range: ${tempData.min.toFixed(1)}°C to ${tempData.max.toFixed(1)}°C
Average: ${tempData.avg.toFixed(1)}°C
Volatility: ${tempData.volatility.toFixed(2)}°C/hour
Trend: ${tempData.trend > 0 ? 'Rising' : 'Falling'} (${Math.abs(tempData.trend).toFixed(1)}°C)
Cloud Cover: ${weatherData.current.cloud_cover}%
Humidity: ${weatherData.current.relative_humidity_2m}%

Provide analysis on:
1. Thermal dynamics and what's causing current temperature behavior
2. Diurnal temperature variation patterns
3. Role of cloud cover and humidity in temperature regulation
4. Heat transfer mechanisms at play (radiation, convection, advection)
5. Expected temperature evolution

Expert insights in 3-4 sentences.`

  try {
    const result = await dalsiaiGenerateText(prompt, 300)
    if (!result || !result.response) {
      console.warn('No response from AI for temperature analysis')
      return null
    }
    return result.response
  } catch (error) {
    console.error('Error generating temperature analysis:', error)
    return null
  }
}

/**
 * Generate AI-enhanced analysis for humidity and moisture
 */
export async function generateHumidityAnalysis(humidityData, weatherData) {
  const prompt = `Analyze atmospheric moisture conditions:

Current Humidity: ${humidityData.current}%
Average: ${humidityData.avg.toFixed(1)}%
Range: ${humidityData.min}% to ${humidityData.max}%
Temperature: ${weatherData.current.temperature_2m}°C
Dew Point: ${weatherData.hourly.dew_point_2m[0]}°C
Cloud Cover: ${weatherData.current.cloud_cover}%

Analyze:
1. Atmospheric moisture saturation level and stability
2. Dew point relationship and condensation potential
3. Impact on human comfort and weather perception
4. Fog, mist, or precipitation likelihood
5. Moisture source and air mass characteristics

Meteorological insights in 3-4 sentences.`

  try {
    const result = await dalsiaiGenerateText(prompt, 300)
    if (!result || !result.response) {
      console.warn('No response from AI for humidity analysis')
      return null
    }
    return result.response
  } catch (error) {
    console.error('Error generating humidity analysis:', error)
    return null
  }
}

/**
 * Generate AI-enhanced analysis for precipitation patterns
 */
export async function generatePrecipitationAnalysis(precipData, weatherData) {
  const prompt = `Analyze precipitation patterns and potential:

Total Precipitation: ${precipData.total.toFixed(1)} mm
Probability: ${precipData.probability}%
Max Rate: ${precipData.max.toFixed(1)} mm/h
Cloud Cover: ${weatherData.current.cloud_cover}%
Humidity: ${weatherData.current.relative_humidity_2m}%
Pressure: ${weatherData.current.pressure_msl} hPa

Provide analysis on:
1. Precipitation formation mechanisms (convective/stratiform/orographic)
2. Atmospheric conditions supporting or inhibiting rainfall
3. Precipitation type and intensity expectations
4. Spatial and temporal distribution patterns
5. Hydrological implications and runoff potential

Expert meteorological analysis in 3-4 sentences.`

  try {
    const result = await dalsiaiGenerateText(prompt, 300)
    if (!result || !result.response) {
      console.warn('No response from AI for precipitation analysis')
      return null
    }
    return result.response
  } catch (error) {
    console.error('Error generating precipitation analysis:', error)
    return null
  }
}

/**
 * Generate synoptic-level weather system analysis
 */
export async function generateSynopticAnalysis(weatherData, duration) {
  const prompt = `Provide a synoptic-scale meteorological analysis for the ${duration} period:

Location: Current weather observation
Pressure: ${weatherData.current.pressure_msl} hPa
Temperature: ${weatherData.current.temperature_2m}°C
Wind: ${weatherData.current.wind_speed_10m} km/h from ${weatherData.current.wind_direction_10m}°
Humidity: ${weatherData.current.relative_humidity_2m}%
Cloud Cover: ${weatherData.current.cloud_cover}%
Precipitation: ${weatherData.current.precipitation} mm

As a synoptic meteorologist, analyze:
1. Dominant weather system type (anticyclone, cyclone, front, ridge, trough)
2. Air mass characteristics and origin
3. Synoptic forcing mechanisms
4. Weather system evolution and movement
5. Expected weather sequence over the analysis period

Provide professional synoptic analysis in 4-5 sentences suitable for a weather briefing.`

  try {
    const result = await dalsiaiGenerateText(prompt, 400)
    if (!result || !result.response) {
      console.warn('No response from AI for synoptic analysis')
      return null
    }
    return result.response
  } catch (error) {
    console.error('Error generating synoptic analysis:', error)
    return null
  }
}

/**
 * Generate chart annotations based on AI analysis
 */
export async function generateChartAnnotations(chartType, data, weatherData) {
  const prompt = `As a meteorologist, identify 2-3 key features to annotate on a ${chartType} weather chart:

Weather Data: ${JSON.stringify(data, null, 2)}

For this ${chartType} chart, identify:
1. Most significant meteorological feature
2. Notable pattern or anomaly
3. Critical threshold or transition point

Return ONLY a JSON array of annotations with this exact structure:
[
  {
    "label": "Brief label text",
    "description": "One sentence explanation",
    "significance": "high|medium|low"
  }
]

Maximum 3 annotations. Be specific and technical.`

  try {
    const result = await dalsiaiGenerateText(prompt, 400)
    if (!result || !result.response) {
      console.warn('No response from AI for chart annotations')
      return []
    }
    // Try to parse JSON from response
    const jsonMatch = result.response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return []
  } catch (error) {
    console.error('Error generating chart annotations:', error)
    return []
  }
}

/**
 * Helper function to convert wind direction degrees to cardinal direction
 */
function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

/**
 * Generate weather phenomena detection and explanation
 */
export async function detectWeatherPhenomena(weatherData) {
  const prompt = `Analyze this weather data to detect and explain any notable meteorological phenomena:

Temperature: ${weatherData.current.temperature_2m}°C
Pressure: ${weatherData.current.pressure_msl} hPa
Wind: ${weatherData.current.wind_speed_10m} km/h, gusts ${weatherData.current.wind_gusts_10m} km/h
Humidity: ${weatherData.current.relative_humidity_2m}%
Cloud Cover: ${weatherData.current.cloud_cover}%
Precipitation: ${weatherData.current.precipitation} mm
Weather Code: ${weatherData.current.weather_code}

Identify any of these phenomena if present:
- Temperature inversions
- Wind shear
- Atmospheric instability
- Frontal boundaries
- Convergence/divergence zones
- Jet stream influence
- Orographic effects
- Sea breeze circulation
- Thermal advection
- Pressure tendency patterns

Return a JSON array of detected phenomena:
[
  {
    "phenomenon": "Name of phenomenon",
    "explanation": "Brief scientific explanation",
    "impact": "Weather impact description"
  }
]

If no notable phenomena, return empty array [].`

  try {
    const result = await dalsiaiGenerateText(prompt, 500)
    if (!result || !result.response) {
      console.warn('No response from AI for phenomena detection')
      return []
    }
    const jsonMatch = result.response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return []
  } catch (error) {
    console.error('Error detecting weather phenomena:', error)
    return []
  }
}

