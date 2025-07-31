import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAuthActions } from '../store/authActions';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const authState = useAuthStore();
  const authActions = useAuthActions();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        authState.setSession(session);
        
        // Load profile when user signs in
        if (session?.user) {
          setTimeout(() => {
            authActions.checkAuthStatus();
          }, 0);
        }
      }
    );

    // Check for existing session
    authActions.checkAuthStatus();

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...authState,
    ...authActions,
  };
};