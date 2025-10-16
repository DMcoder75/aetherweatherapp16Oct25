/**
 * Authentication Helper Functions
 * Handles password hashing and custom authentication with Supabase
 */

import { supabase } from './supabaseClient';

/**
 * Simple password hashing using Web Crypto API
 * In production, use a proper backend with bcrypt or similar
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify password against stored hash
 */
async function verifyPassword(password, storedHash) {
  const inputHash = await hashPassword(password);
  return inputHash === storedHash;
}

/**
 * Sign up a new user
 * Creates user in Supabase
 */
export async function signUpUser(email, password, fullName) {
  try {
    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create user in Supabase
    const newUserId = crypto.randomUUID();
    const { data: newUserProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: newUserId,
        email: email,
        password_hash: passwordHash,
        full_name: fullName,
        email_verified: false,
        enabled: true,
        default_location: 'Melbourne, Australia',
        default_latitude: -37.8136,
        default_longitude: 144.9631,
        preferences: { theme: 'dark', units: 'metric', notifications: true }
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return { user: newUserProfile, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign in an existing user
 * Validates credentials against Supabase
 */
export async function signInUser(email, password) {
  try {
    // Fetch user from Supabase to check custom fields (enabled, email_verified)
    const { data: userProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*, password_hash') // Select password_hash for verification
      .eq('email', email)
      .single();

    if (fetchError || !userProfile) {
      throw new Error('Invalid email or password');
    }

    // Check if user is enabled
    if (!userProfile.enabled) {
      throw new Error('Your account has been disabled. Please contact support.');
    }

    // Verify password against stored hash (custom logic)
    const isPasswordValid = await verifyPassword(password, userProfile.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Check if email is verified (optional warning)
    if (!userProfile.email_verified) {
      console.warn('Email not verified. Some features may be limited.');
    }

    return { user: userProfile, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign out the current user
 */
export async function signOutUser() {
  try {
    // Clear local storage
    localStorage.removeItem('aether_user_id');
    // No Firebase signOut needed

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Get current user from local storage and Supabase
 */
export async function getCurrentUserFromSupabase() {
  try {
    const userId = localStorage.getItem('aether_user_id');
    if (!userId) {
      return { user: null, error: null };
    }

    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { user: userProfile, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

