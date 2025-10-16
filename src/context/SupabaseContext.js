import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { getCurrentUserFromSupabase } from '../utils/authHelpers';

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const setAppUserId = useCallback(async (userId) => {
    if (userId) {
      const { error } = await supabase.rpc('set_config', { key: 'app.user_id', value: userId });
      if (error) {
        console.error('Error setting app.user_id for RLS:', error);
      }
    } else {
      const { error } = await supabase.rpc('set_config', { key: 'app.user_id', value: null });
      if (error) {
        console.error('Error clearing app.user_id for RLS:', error);
      }
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const { user, error } = await getCurrentUserFromSupabase();
      if (user) {
        setCurrentUser(user);
        setAppUserId(user.id);
      } else if (error) {
        console.error('Error loading user from Supabase:', error);
        setCurrentUser(null);
        setAppUserId(null);
      } else {
        setCurrentUser(null);
        setAppUserId(null);
      }
      setLoadingUser(false);
    };

    loadUser();
  }, [setAppUserId]);

  const value = {
    currentUser,
    loadingUser,
    supabase,
    setAppUserId,
    setCurrentUser,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {!loadingUser && children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

