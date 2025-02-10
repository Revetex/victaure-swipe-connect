
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "./ui/loader";
import { toast } from "sonner";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;

    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying auth check (${retryCount}/${MAX_RETRIES})...`);
            setTimeout(checkAuth, RETRY_DELAY);
            return;
          }
          toast.error("Erreur d'authentification");
          setIsAuthenticated(false);
          return;
        }

        if (!session) {
          console.log("No active session");
          setIsAuthenticated(false);
          return;
        }

        // Check if session is expired
        const expiresAt = new Date(session.expires_at || 0).getTime();
        const now = new Date().getTime();
        const timeToExpire = expiresAt - now;

        // If session expires in less than 5 minutes, try to refresh
        if (timeToExpire < 300000) {
          console.log("Session expiring soon, refreshing...");
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Session refresh error:", refreshError);
            toast.error("Erreur de rafraîchissement de session");
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
            toast.error("Erreur de vérification utilisateur");
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        };

        await verifyUser();

      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur de vérification de session");
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

    // Periodic auth check every 5 minutes
    const authCheckInterval = setInterval(checkAuth, 300000);

    return () => {
      mounted = false;
      clearInterval(authCheckInterval);
      subscription.unsubscribe();
    };
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted URL
    sessionStorage.setItem('redirectTo', location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
