// Alert Acknowledgment System
// Tracks which weather alerts have been acknowledged by users
// Works for both guest users (localStorage) and registered users (Firestore)

import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from './firebaseConfig'

/**
 * Generate unique alert ID based on location, type, and time
 * @param {string} location - Location name
 * @param {string} alertType - Type of alert (e.g., 'high-humidity', 'extreme-heat')
 * @param {object} weatherData - Current weather data
 * @returns {string} Unique alert ID
 */
export function generateAlertId(location, alertType, weatherData) {
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const hourStr = String(now.getHours()).padStart(2, '0')
  
  // Normalize location name
  const normalizedLocation = location.toLowerCase().replace(/[^a-z0-9]/g, '-')
  
  // Include key weather values to ensure uniqueness
  const temp = weatherData?.current?.temperature_2m?.toFixed(0) || '0'
  const humidity = weatherData?.current?.relative_humidity_2m || '0'
  
  return `${normalizedLocation}-${alertType}-${dateStr}-${hourStr}-${temp}-${humidity}`
}

/**
 * Determine alert type from weather data
 * @param {object} weatherData - Current weather data
 * @returns {string} Alert type
 */
export function determineAlertType(weatherData) {
  if (!weatherData?.current) return 'general'
  
  const { current, daily } = weatherData
  const temp = current.temperature_2m
  const humidity = current.relative_humidity_2m
  const windSpeed = current.wind_speed_10m
  const precipitation = current.precipitation
  const uvIndex = daily?.uv_index_max?.[0] || 0
  
  // Priority order: most critical first
  if (temp >= 40) return 'extreme-heat'
  if (temp < 0) return 'freezing'
  if (windSpeed >= 60) return 'dangerous-wind'
  if (precipitation > 10) return 'heavy-rain'
  if (uvIndex >= 8) return 'high-uv'
  if (temp >= 35) return 'high-heat'
  if (temp < 5) return 'cold'
  if (windSpeed >= 40) return 'strong-wind'
  if (humidity >= 85) return 'high-humidity'
  if (precipitation > 0) return 'precipitation'
  
  return 'general'
}

/**
 * Check if alert has been acknowledged (guest user - localStorage)
 * @param {string} alertId - Alert ID
 * @returns {boolean} True if acknowledged
 */
export function isAlertAcknowledgedLocal(alertId) {
  try {
    const acknowledgedAlerts = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]')
    return acknowledgedAlerts.includes(alertId)
  } catch (error) {
    console.error('Error checking acknowledged alerts:', error)
    return false
  }
}

/**
 * Acknowledge alert (guest user - localStorage)
 * @param {string} alertId - Alert ID
 */
export function acknowledgeAlertLocal(alertId) {
  try {
    const acknowledgedAlerts = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]')
    if (!acknowledgedAlerts.includes(alertId)) {
      acknowledgedAlerts.push(alertId)
      localStorage.setItem('acknowledgedAlerts', JSON.stringify(acknowledgedAlerts))
      
      // Clean up old alerts (keep only last 100)
      if (acknowledgedAlerts.length > 100) {
        const recentAlerts = acknowledgedAlerts.slice(-100)
        localStorage.setItem('acknowledgedAlerts', JSON.stringify(recentAlerts))
      }
    }
  } catch (error) {
    console.error('Error acknowledging alert:', error)
  }
}

/**
 * Check if alert has been acknowledged (registered user - Firestore)
 * @param {string} userId - User ID
 * @param {string} alertId - Alert ID
 * @returns {Promise<boolean>} True if acknowledged
 */
export async function isAlertAcknowledgedFirestore(userId, alertId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      const acknowledgedAlerts = userDoc.data().acknowledgedAlerts || []
      return acknowledgedAlerts.includes(alertId)
    }
    return false
  } catch (error) {
    console.error('Error checking acknowledged alerts in Firestore:', error)
    return false
  }
}

/**
 * Acknowledge alert (registered user - Firestore)
 * @param {string} userId - User ID
 * @param {string} alertId - Alert ID
 */
export async function acknowledgeAlertFirestore(userId, alertId) {
  try {
    const userDocRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userDocRef, {
        acknowledgedAlerts: arrayUnion(alertId),
        lastAlertAcknowledged: new Date().toISOString()
      })
    } else {
      // Create new document
      await setDoc(userDocRef, {
        acknowledgedAlerts: [alertId],
        lastAlertAcknowledged: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })
    }
    
    // Clean up old alerts (keep only last 50 in Firestore)
    const updatedDoc = await getDoc(userDocRef)
    const acknowledgedAlerts = updatedDoc.data().acknowledgedAlerts || []
    if (acknowledgedAlerts.length > 50) {
      const recentAlerts = acknowledgedAlerts.slice(-50)
      await updateDoc(userDocRef, {
        acknowledgedAlerts: recentAlerts
      })
    }
  } catch (error) {
    console.error('Error acknowledging alert in Firestore:', error)
  }
}

/**
 * Check if alert should be shown (unified for guest and registered users)
 * @param {object} user - User object (null for guest)
 * @param {string} location - Location name
 * @param {object} weatherData - Weather data
 * @returns {Promise<boolean>} True if alert should be shown
 */
export async function shouldShowAlert(user, location, weatherData) {
  const alertType = determineAlertType(weatherData)
  const alertId = generateAlertId(location, alertType, weatherData)
  
  if (user) {
    // Registered user - check Firestore
    return !(await isAlertAcknowledgedFirestore(user.uid, alertId))
  } else {
    // Guest user - check localStorage
    return !isAlertAcknowledgedLocal(alertId)
  }
}

/**
 * Acknowledge current alert (unified for guest and registered users)
 * @param {object} user - User object (null for guest)
 * @param {string} location - Location name
 * @param {object} weatherData - Weather data
 */
export async function acknowledgeCurrentAlert(user, location, weatherData) {
  const alertType = determineAlertType(weatherData)
  const alertId = generateAlertId(location, alertType, weatherData)
  
  if (user) {
    // Registered user - save to Firestore
    await acknowledgeAlertFirestore(user.uid, alertId)
  } else {
    // Guest user - save to localStorage
    acknowledgeAlertLocal(alertId)
  }
}

/**
 * Get alert severity level
 * @param {string} alertType - Alert type
 * @returns {string} Severity level
 */
export function getAlertSeverity(alertType) {
  const criticalAlerts = ['extreme-heat', 'freezing', 'dangerous-wind', 'heavy-rain']
  const highAlerts = ['high-heat', 'cold', 'strong-wind', 'high-uv']
  const moderateAlerts = ['high-humidity', 'precipitation']
  
  if (criticalAlerts.includes(alertType)) return 'critical'
  if (highAlerts.includes(alertType)) return 'high'
  if (moderateAlerts.includes(alertType)) return 'moderate'
  return 'low'
}

