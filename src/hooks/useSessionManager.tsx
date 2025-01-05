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
    // Initialize session
    const initSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        if (!currentSession) {
          console.log("No active session found");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        toast.error("Erreur d'initialisation de la session");
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        localStorage.clear();
        navigate("/auth");
        toast.info("Déconnexion réussie");
      } 
      else if (event === 'SIGNED_IN' && currentSession) {
        setSession(currentSession);
        navigate("/dashboard");
        toast.success("Connexion réussie");
      }
      else if (event === 'TOKEN_REFRESHED' && currentSession) {
        setSession(currentSession);
        console.log("Token refreshed successfully");
      }
      else if (event === 'USER_UPDATED') {
        setSession(currentSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { session, loading };
};