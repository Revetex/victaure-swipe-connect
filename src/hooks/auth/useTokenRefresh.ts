
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleAuthError } from '@/utils/authUtils';

export function useTokenRefresh(signOut: () => Promise<void>) {
  useEffect(() => {
    let refreshTimeout: NodeJS.Timeout | null = null;

    const setupRefreshTimeout = (expiresAt: number) => {
      const timeUntilExpiry = (expiresAt * 1000) - Date.now();
      const refreshTime = Math.max(0, timeUntilExpiry - (5 * 60 * 1000)); // 5 minutes before expiry
      
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(async () => {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Session refresh error:', refreshError);
          handleAuthError(refreshError, signOut);
        }
      }, refreshTime);
    };

    // Initial setup
    supabase.auth.getSession().then(({ data: { session }}) => {
      if (session?.expires_at) {
        setupRefreshTimeout(session.expires_at);
      }
    });

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
    };
  }, [signOut]);
}
