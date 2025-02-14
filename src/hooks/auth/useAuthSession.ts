
import { useEffect, useCallback } from 'react';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { handleAuthError } from '@/utils/authUtils';
import { toast } from 'sonner';

export function useAuthSession(
  setState: Function, 
  signOut: () => Promise<void>, 
  mounted: boolean
) {
  const verifyUser = useCallback(async (attempt = 0): Promise<void> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        if (attempt < 3) {
          console.log(`Retrying user verification (${attempt + 1}/3)...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return verifyUser(attempt + 1);
        }
        throw userError;
      }

      if (mounted) {
        setState({
          isLoading: false,
          isAuthenticated: true,
          error: null,
          user
        });
      }
    } catch (error) {
      console.error("User verification error:", error);
      if (error instanceof AuthError) {
        handleAuthError(error, signOut);
      } else {
        console.error("Unexpected error type:", error);
        toast.error("Une erreur inattendue s'est produite");
        signOut();
      }
      if (mounted) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Authentication failed'),
          user: null
        });
      }
    }
  }, [setState, signOut, mounted]);

  const initializeAuth = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        handleAuthError(sessionError, signOut);
        return;
      }

      if (!session) {
        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: false,
            error: null,
            user: null
          });
        }
        return;
      }

      await verifyUser();

    } catch (error) {
      console.error("Auth initialization error:", error);
      if (error instanceof AuthError) {
        handleAuthError(error, signOut);
      } else {
        console.error("Unexpected error type:", error);
        toast.error("Une erreur inattendue s'est produite");
        signOut();
      }
      if (mounted) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error : new Error('Authentication failed'),
          user: null
        });
      }
    }
  }, [setState, signOut, verifyUser, mounted]);

  return { initializeAuth, verifyUser };
}
