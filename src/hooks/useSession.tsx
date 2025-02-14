
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { handleAuthError } from '@/utils/authUtils';
import { toast } from 'sonner';

interface SessionState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

export const useSession = (signOut: () => Promise<void>) => {
  const [state, setState] = useState<SessionState>({
    session: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second delay between retries

    const checkSession = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying session check (${retryCount}/${MAX_RETRIES})...`);
            setTimeout(checkSession, RETRY_DELAY);
            return;
          }
          handleAuthError(sessionError, signOut);
          return;
        }
        
        if (!session) {
          if (mounted) {
            setState({ session: null, user: null, isLoading: false });
          }
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying user verification (${retryCount}/${MAX_RETRIES})...`);
            setTimeout(checkSession, RETRY_DELAY);
            return;
          }
          handleAuthError(userError, signOut);
          return;
        }

        if (mounted) {
          setState({
            session,
            user,
            isLoading: false,
          });
        }

      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
        toast.error("Erreur de vérification de session");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          setState({
            session,
            user,
            isLoading: false,
          });
        } else {
          setState({
            session: null,
            user: null,
            isLoading: false,
          });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [signOut]);

  return state;
};
