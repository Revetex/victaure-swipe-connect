
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader } from "./ui/loader";

// Fonction utilitaire pour détecter les appareils mobiles
const detectMobileDevice = () => {
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();
  const isMobile = detectMobileDevice();

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    // Paramètres adaptés selon la plateforme
    const MAX_RETRIES = isMobile ? 2 : 3;
    const RETRY_DELAY = isMobile ? 800 : 1000;
    const AUTH_CHECK_INTERVAL = isMobile ? 600000 : 300000; // 10min sur mobile, 5min sur desktop

    const checkAuth = async () => {
      try {
        // Configuration du timeout pour le mobile
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Auth check timed out")), isMobile ? 5000 : 10000)
        );
        
        // Get current session
        const sessionPromise = supabase.auth.getSession();
        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying auth check (${retryCount}/${MAX_RETRIES})...`);
            setTimeout(checkAuth, RETRY_DELAY);
            return;
          }
          throw sessionError;
        }

        if (!session) {
          console.log("No active session");
          if (mounted) {
            setIsAuthenticated(false);
            setIsCheckingAuth(false);
          }
          return;
        }

        // Check if session is expired
        const expiresAt = new Date(session.expires_at || 0).getTime();
        const now = new Date().getTime();
        const timeToExpire = expiresAt - now;

        // For mobile, refresh token if expiring soon
        const refreshThreshold = isMobile ? 600000 : 300000; // 10min vs 5min
        
        // If session expires in less than the threshold, try to refresh
        if (timeToExpire < refreshThreshold) {
          console.log("Session expiring soon, refreshing...");
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Session refresh error:", refreshError);
            
            // Sur mobile, notification moins intrusive
            if (isMobile) {
              console.warn("Échec du rafraîchissement de session");
            } else {
              toast.error("Erreur de rafraîchissement de session");
            }
            
            setIsAuthenticated(false);
            return;
          }

          if (!refreshedSession) {
            console.log("Could not refresh session");
            setIsAuthenticated(false);
            return;
          }
        }

        // Verify user data with retry logic
        const verifyUser = async (attempt = 0): Promise<void> => {
          try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
              if (attempt < MAX_RETRIES) {
                console.log(`Retrying user verification (${attempt + 1}/${MAX_RETRIES})...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return verifyUser(attempt + 1);
              }
              throw userError || new Error("User not found");
            }

            if (mounted) {
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error("User verification error:", error);
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        };

        await verifyUser();

      } catch (error) {
        console.error("Auth check error:", error);
        
        // Sur mobile, notification moins intrusive
        if (!isMobile) {
          toast.error("Erreur de vérification de session");
        }
        
        setIsAuthenticated(false);
      } finally {
        if (mounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
        setIsAuthenticated(true);
      }
    });

    // Initial auth check
    checkAuth();

    // Periodic auth check - intervalle plus long sur mobile pour économiser la batterie
    const authCheckInterval = setInterval(checkAuth, AUTH_CHECK_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(authCheckInterval);
      subscription.unsubscribe();
    };
  }, [isMobile]);

  // UI adaptée pour mobile (plus légère)
  if (isCheckingAuth) {
    return (
      <div className="h-[100vh] h-[calc(var(--vh,1vh)*100)] w-full flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.2 : 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <Loader className="w-8 h-8 text-primary" />
            {!isMobile && (
              <motion.div 
                className="absolute inset-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3] 
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Loader className="w-8 h-8 text-primary/20" />
              </motion.div>
            )}
          </div>
          <p className={`text-sm text-muted-foreground ${isMobile ? '' : 'animate-pulse'}`}>
            Vérification de vos accès...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted URL
    sessionStorage.setItem('redirectTo', location.pathname);
    
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isMobile ? 0.1 : 0.2 }}
      >
        <Navigate to="/auth" replace state={{ from: location }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isMobile ? 0.2 : 0.3 }}
    >
      {children}
    </motion.div>
  );
}
