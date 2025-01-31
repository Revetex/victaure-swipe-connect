import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export const useSessionManager = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initSession = async () => {
      try {
        // First try to recover the session from storage
        const { data: { session: storedSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (storedSession) {
          // Verify the session is still valid
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("User verification error:", userError);
            // If there's an error, clear the invalid session
            await supabase.auth.signOut();
            setSession(null);
            navigate("/auth");
            return;
          }

          if (user) {
            setSession(storedSession);
          }
        } else {
          // No stored session found, redirect to auth
          navigate("/auth");
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        toast.error("Erreur d'initialisation de la session");
        // Clear any invalid session data
        await supabase.auth.signOut();
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !currentSession) {
        setSession(null);
        localStorage.clear(); // Clear all local storage to ensure no stale tokens remain
        toast.info("Session expirée, veuillez vous reconnecter");
        navigate("/auth");
      } else if (event === 'SIGNED_IN') {
        setSession(currentSession);
        toast.success("Connexion réussie");
        navigate("/dashboard");
      } else if (event === 'TOKEN_REFRESHED' && currentSession) {
        setSession(currentSession);
        console.log("Token refreshed successfully");
      } else if (event === 'USER_UPDATED') {
        setSession(currentSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { session, loading };
};