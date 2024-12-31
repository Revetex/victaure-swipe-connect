import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Rate limiting state
  const [loginAttempts, setLoginAttempts] = useState(() => {
    const stored = localStorage.getItem('loginAttempts');
    return stored ? JSON.parse(stored) : { count: 0, timestamp: 0 };
  });

  useEffect(() => {
    localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
  }, [loginAttempts]);

  const checkRateLimit = () => {
    const now = Date.now();
    if (loginAttempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLockout = now - loginAttempts.timestamp;
      if (timeSinceLockout < LOCKOUT_DURATION) {
        const remainingMinutes = Math.ceil((LOCKOUT_DURATION - timeSinceLockout) / 60000);
        toast.error(`Trop de tentatives. Réessayez dans ${remainingMinutes} minutes.`);
        return false;
      }
      // Reset after lockout period
      setLoginAttempts({ count: 0, timestamp: now });
    }
    return true;
  };

  const incrementLoginAttempts = () => {
    const now = Date.now();
    setLoginAttempts(prev => ({
      count: prev.count + 1,
      timestamp: now
    }));
  };

  const resetLoginAttempts = () => {
    setLoginAttempts({ count: 0, timestamp: 0 });
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }

      if (!session) {
        console.log('No active session found, clearing storage');
        localStorage.clear();
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate('/auth');
        return;
      }

      localStorage.clear();
      sessionStorage.clear();
      
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error("Sign out error:", signOutError);
        throw signOutError;
      }
      
      setIsAuthenticated(false);
      navigate('/auth');
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
        if (!session) {
          if (mounted) {
            setIsAuthenticated(false);
            if (window.location.pathname !== '/auth') {
              navigate('/auth');
            }
          }
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User verification error:", userError);
          throw userError;
        }

        if (!user) {
          throw new Error('No user found');
        }

        if (mounted) {
          setIsAuthenticated(true);
          resetLoginAttempts(); // Reset attempts on successful auth
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          incrementLoginAttempts();
          await signOut();
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        resetLoginAttempts();
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT' || !session) {
        await signOut();
      }
    });

    // Set up session refresh
    const refreshInterval = setInterval(async () => {
      if (isAuthenticated) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.expires_at) {
          const expiresAt = new Date(session.expires_at * 1000);
          const now = new Date();
          const timeUntilExpiry = expiresAt.getTime() - now.getTime();
          
          // Refresh token 5 minutes before expiry
          if (timeUntilExpiry < 5 * 60 * 1000) {
            const { error } = await supabase.auth.refreshSession();
            if (error) {
              console.error('Session refresh error:', error);
              await signOut();
            }
          }
        }
      }
    }, 60 * 1000); // Check every minute

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [navigate, isAuthenticated]);

  return { 
    isLoading, 
    isAuthenticated, 
    signOut,
    checkRateLimit 
  };
}