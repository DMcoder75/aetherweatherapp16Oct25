/**
 * Event-Based Weather Analysis using AI
 * Detects and predicts specific weather events with probability scores
 */

import { dalsiaiGenerateText } from './dalsiApi.js'

/**
 * Detect potential weather events from forecast data
 */
export function detectWeatherEvents(hourly, daily) {
  const events = []
  
  // Analyze next 7 days for patterns
  for (let day = 0; day < Math.min(7, daily.time.length); day++) {
    const dayStart = day * 24
    const dayEnd = Math.min((day + 1) * 24, hourly.time.length)
    const dayHourly = {
      temperature_2m: hourly.temperature_2m.slice(dayStart, dayEnd),
      precipitation_probability: hourly.precipitation_probability.slice(dayStart, dayEnd),
      precipitation: hourly.precipitation ? hourly.precipitation.slice(dayStart, dayEnd) : [],
      wind_speed_10m: hourly.wind_speed_10m.slice(dayStart, dayEnd),
      wind_gusts_10m: hourly.wind_gusts_10m ? hourly.wind_gusts_10m.slice(dayStart, dayEnd) : [],
      weather_code: hourly.weather_code.slice(dayStart, dayEnd)
    }
    
    const date = new Date(daily.time[day])
    const dayName = day === 0 ? 'Today' : day === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' })
    
    // Detect heatwave
    if (daily.temperature_2m_max[day] > 32 && daily.temperature_2m_max[day + 1] > 32) {
      const duration = countConsecutiveDays(daily.temperature_2m_max, day, temp => temp > 32)
      events.push({
        type: 'heatwave',
        day: dayName,
        date: date.toLocaleDateString(),
        probability: calculateHeatwaveProbability(daily, day),
        severity: daily.temperature_2m_max[day] > 38 ? 'extreme' : 'high',
        details: {
          maxTemp: daily.temperature_2m_max[day],
          duration: duration,
          uvIndex: daily.uv_index_max[day]
        },
        description: `Heatwave conditions with temperatures reaching ${daily.temperature_2m_max[day].toFixed(0)}°C for ${duration} day(s)`
      })
    }
    
    // Detect cold snap
    if (daily.temperature_2m_min[day] < 5 && daily.temperature_2m_max[day] < 12) {
      events.push({
        type: 'cold_snap',
        day: dayName,
        date: date.toLocaleDateString(),
        probability: calculateColdSnapProbability(daily, day),
        severity: daily.temperature_2m_min[day] < 0 ? 'extreme' : 'moderate',
        details: {
          minTemp: daily.temperature_2m_min[day],
          maxTemp: daily.temperature_2m_max[day]
        },
        description: `Cold conditions with temperatures ${daily.temperature_2m_min[day].toFixed(0)}°C to ${daily.temperature_2m_max[day].toFixed(0)}°C`
      })
    }
    
    // Detect heavy rain event
    const totalPrecip = daily.precipitation_sum ? daily.precipitation_sum[day] : 0
    const maxPrecipProb = daily.precipitation_probability_max[day]
    if (totalPrecip > 15 || maxPrecipProb > 70) {
      events.push({
        type: 'heavy_rain',
        day: dayName,
        date: date.toLocaleDateString(),
        probability: maxPrecipProb,
        severity: totalPrecip > 30 ? 'high' : 'moderate',
        details: {
          totalPrecipitation: totalPrecip,
          maxProbability: maxPrecipProb
        },
        description: `Heavy rainfall expected (${totalPrecip.toFixed(1)}mm) with ${maxPrecipProb}% probability`
      })
    }
    
    // Detect thunderstorm
    const hasThunderstorm = dayHourly.weather_code.some(code => code >= 95 && code <= 99)
    if (hasThunderstorm || (maxPrecipProb > 60 && daily.temperature_2m_max[day] > 25)) {
      const thunderstormHours = dayHourly.weather_code.filter(code => code >= 95 && code <= 99).length
      events.push({
        type: 'thunderstorm',
        day: dayName,
        date: date.toLocaleDateString(),
        probability: hasThunderstorm ? 85 : 60,
        severity: thunderstormHours > 3 ? 'high' : 'moderate',
        details: {
          expectedHours: thunderstormHours,
          temperature: daily.temperature_2m_max[day]
        },
        description: `Thunderstorm activity likely${thunderstormHours > 0 ? ` for ${thunderstormHours} hour(s)` : ''}`
      })
    }
    
    // Detect strong wind event
    const maxWind = daily.wind_speed_10m_max ? daily.wind_speed_10m_max[day] : 0
    const maxGusts = daily.wind_gusts_10m_max ? daily.wind_gusts_10m_max[day] : 0
    if (maxWind > 40 || maxGusts > 60) {
      events.push({
        type: 'strong_wind',
        day: dayName,
        date: date.toLocaleDateString(),
        probability: calculateWindProbability(maxWind, maxGusts),
        severity: maxGusts > 80 ? 'extreme' : maxGusts > 60 ? 'high' : 'moderate',
        details: {
          maxWind: maxWind,
          maxGusts: maxGusts
        },
        description: `Strong winds up to ${maxWind.toFixed(0)} km/h with gusts to ${maxGusts.toFixed(0)} km/h`
      })
    }
    
    // Detect rapid temperature change (cold front/warm front)
    if (day > 0) {
      const tempChange = daily.temperature_2m_max[day] - daily.temperature_2m_max[day - 1]
      if (Math.abs(tempChange) > 10) {
        events.push({
          type: tempChange > 0 ? 'warm_front' : 'cold_front',
          day: dayName,
          date: date.toLocaleDateString(),
          probability: 80,
          severity: Math.abs(tempChange) > 15 ? 'high' : 'moderate',
          details: {
            temperatureChange: tempChange,
            previousTemp: daily.temperature_2m_max[day - 1],
            newTemp: daily.temperature_2m_max[day]
          },
          description: `${tempChange > 0 ? 'Warming' : 'Cooling'} trend: ${Math.abs(tempChange).toFixed(0)}°C ${tempChange > 0 ? 'increase' : 'decrease'}`
        })
      }
    }
  }
  
  return events.sort((a, b) => b.probability - a.probability)
}

/**
 * Generate AI-powered event analysis and predictions
 */
export async function generateEventBasedForecast(weatherData, location) {
  const events = detectWeatherEvents(weatherData.hourly, weatherData.daily)
  
  // Prepare data summary for AI
  const next7Days = weatherData.daily.time.slice(0, 7).map((time, i) => ({
    date: new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    tempMin: weatherData.daily.temperature_2m_min[i],
    tempMax: weatherData.daily.temperature_2m_max[i],
    precipProb: weatherData.daily.precipitation_probability_max[i],
    precipSum: weatherData.daily.precipitation_sum ? weatherData.daily.precipitation_sum[i] : 0,
    windMax: weatherData.daily.wind_speed_10m_max ? weatherData.daily.wind_speed_10m_max[i] : 0
  }))
  
  const prompt = `Analyze the following 7-day weather forecast for ${location} and identify HIGH-PROBABILITY weather events with specific timing and impact:

${next7Days.map(day => 
  `${day.date}: ${day.tempMin.toFixed(0)}-${day.tempMax.toFixed(0)}°C, ${day.precipProb}% rain (${day.precipSum.toFixed(1)}mm), wind ${day.windMax.toFixed(0)} km/h`
).join('\n')}

Detected Events:
${events.slice(0, 5).map(e => `- ${e.type}: ${e.day}, ${e.probability}% probability, ${e.description}`).join('\n')}

Provide:
1. Top 3 most significant weather events with probability percentages
2. Specific timing (day and time period)
3. Practical impact on daily activities
4. Preparation recommendations

Format as concise bullet points.`

  try {
    console.log("AI Analysis Prompt:", prompt);
    const response = await dalsiaiGenerateText(prompt, 300);
    console.log("AI Analysis Raw Response:", response);
    return {
      events: events,
      aiAnalysis: response && response.response ? response.response : 'Analysis unavailable',
      summary: generateEventSummary(events)
    }
  } catch (error) {
    console.error("Error generating AI event forecast:", error);
    console.log("AI Analysis Prompt that caused error:", prompt);
    return {
      events: events,
      aiAnalysis: 'AI analysis temporarily unavailable',
      summary: generateEventSummary(events)
    }
  }
}

/**
 * Helper functions for probability calculations
 */
function calculateHeatwaveProbability(daily, day) {
  const temp = daily.temperature_2m_max[day]
  if (temp > 38) return 95
  if (temp > 35) return 85
  if (temp > 32) return 75
  return 60
}

function calculateColdSnapProbability(daily, day) {
  const temp = daily.temperature_2m_min[day]
  if (temp < 0) return 95
  if (temp < 3) return 85
  if (temp < 5) return 75
  return 60
}

function calculateWindProbability(wind, gusts) {
  if (gusts > 80) return 90
  if (gusts > 60) return 80
  if (wind > 50) return 75
  if (wind > 40) return 70
  return 60
}

function countConsecutiveDays(values, startIndex, condition) {
  let count = 0
  for (let i = startIndex; i < values.length && condition(values[i]); i++) {
    count++
  }
  return count
}

function generateEventSummary(events) {
  if (events.length === 0) return 'No significant weather events detected in the next 7 days'
  
  const highPriorityEvents = events.filter(e => e.probability > 70)
  if (highPriorityEvents.length === 0) return `${events.length} potential weather events detected with moderate probability`
  
  return `${highPriorityEvents.length} high-probability weather events detected in the next 7 days`
}

