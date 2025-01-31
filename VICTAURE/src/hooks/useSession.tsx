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

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
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

    return () => {
      mounted = false;
    };
  }, [signOut]);

  return state;
};