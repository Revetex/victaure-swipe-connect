import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { handleAuthError } from '@/utils/authUtils';

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
    const checkSession = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          handleAuthError(sessionError, signOut);
          return;
        }
        
        if (!session) {
          setState({ session: null, user: null, isLoading: false });
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          handleAuthError(userError, signOut);
          return;
        }

        setState({
          session,
          user,
          isLoading: false,
        });
      } catch (error) {
        console.error('Session check error:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkSession();
  }, [signOut]);

  return state;
};