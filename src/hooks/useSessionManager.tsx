import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

export const useSessionManager = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        // Clear any stale session data
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("Error clearing session:", signOutError);
        }

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Erreur de connexion");
          return;
        }

        if (currentSession) {
          // Verify the session is valid by attempting to refresh
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error("Session refresh error:", refreshError);
            toast.error("Session expirée, veuillez vous reconnecter");
            await supabase.auth.signOut();
            setSession(null);
            return;
          }
          setSession(currentSession);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        toast.error("Erreur d'initialisation de la session");
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        toast.info("Déconnexion effectuée");
      } else if (event === 'SIGNED_IN') {
        setSession(currentSession);
        toast.success("Connexion réussie");
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
        console.log("Token refreshed successfully");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};