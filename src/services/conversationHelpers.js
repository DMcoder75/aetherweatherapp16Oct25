import { supabase } from './supabaseClient.js'

/**
 * Save a conversation message to Supabase
 * @param {string} userId - The user's ID
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - The message content
 * @param {object} weatherContext - Current weather data context
 * @returns {Promise<object>} The saved conversation record
 */
export async function saveConversationMessage(userId, role, content, weatherContext = null) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          user_id: userId,
          role,
          content,
          weather_context: weatherContext,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving conversation:', error)
    return null
  }
}

/**
 * Get conversation history for a user
 * @param {string} userId - The user's ID
 * @param {number} limit - Maximum number of messages to retrieve
 * @returns {Promise<array>} Array of conversation messages
 */
export async function getConversationHistory(userId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data.reverse() // Return in chronological order
  } catch (error) {
    console.error('Error fetching conversation history:', error)
    return []
  }
}

/**
 * Save or update user location preferences
 * @param {string} userId - The user's ID
 * @param {object} locationData - Location data (home_address, office_address, etc.)
 * @returns {Promise<object>} The saved user preferences
 */
export async function saveUserLocationPreferences(userId, locationData) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([
        {
          user_id: userId,
          ...locationData,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving user preferences:', error)
    return null
  }
}

/**
 * Get user location preferences
 * @param {string} userId - The user's ID
 * @returns {Promise<object>} User preferences object
 */
export async function getUserLocationPreferences(userId) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No preferences found, return default
        return {
          home_address: null,
          home_latitude: null,
          home_longitude: null,
          office_address: null,
          office_latitude: null,
          office_longitude: null
        }
      }
      throw error
    }
    return data
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return null
  }
}

/**
 * Analyze conversation history to learn user preferences
 * @param {string} userId - The user's ID
 * @returns {Promise<object>} Analyzed user patterns and preferences
 */
export async function analyzeUserConversationPatterns(userId) {
  try {
    const history = await getConversationHistory(userId, 100)
    
    const patterns = {
      commonTopics: [],
      frequentActivities: [],
      preferredTimes: [],
      weatherSensitivities: []
    }

    // Simple keyword analysis
    const allContent = history
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content.toLowerCase())
      .join(' ')

    // Detect common activities
    const activities = ['running', 'cycling', 'walking', 'hiking', 'commute', 'office', 'outdoor', 'indoor']
    activities.forEach(activity => {
      if (allContent.includes(activity)) {
        patterns.frequentActivities.push(activity)
      }
    })

    // Detect weather sensitivities
    const sensitivities = ['rain', 'cold', 'hot', 'wind', 'humidity', 'snow']
    sensitivities.forEach(sensitivity => {
      if (allContent.includes(sensitivity)) {
        patterns.weatherSensitivities.push(sensitivity)
      }
    })

    return patterns
  } catch (error) {
    console.error('Error analyzing conversation patterns:', error)
    return null
  }
}

/**
 * Create database tables if they don't exist (SQL for reference)
 * Run these SQL commands in Supabase SQL Editor:
 * 
 * -- Conversations table
 * CREATE TABLE IF NOT EXISTS conversations (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
 *   content TEXT NOT NULL,
 *   weather_context JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_conversations_user_id ON conversations(user_id);
 * CREATE INDEX idx_conversations_created_at ON conversations(created_at);
 * 
 * -- User preferences table
 * CREATE TABLE IF NOT EXISTS user_preferences (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
 *   home_address TEXT,
 *   home_latitude DOUBLE PRECISION,
 *   home_longitude DOUBLE PRECISION,
 *   office_address TEXT,
 *   office_latitude DOUBLE PRECISION,
 *   office_longitude DOUBLE PRECISION,
 *   notification_preferences JSONB DEFAULT '{}',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
 * 
 * -- Enable Row Level Security
 * ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
 * 
 * -- RLS Policies for conversations
 * CREATE POLICY "Users can view their own conversations"
 *   ON conversations FOR SELECT
 *   USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert their own conversations"
 *   ON conversations FOR INSERT
 *   WITH CHECK (auth.uid() = user_id);
 * 
 * -- RLS Policies for user_preferences
 * CREATE POLICY "Users can view their own preferences"
 *   ON user_preferences FOR SELECT
 *   USING (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can insert their own preferences"
 *   ON user_preferences FOR INSERT
 *   WITH CHECK (auth.uid() = user_id);
 * 
 * CREATE POLICY "Users can update their own preferences"
 *   ON user_preferences FOR UPDATE
 *   USING (auth.uid() = user_id);
 */

