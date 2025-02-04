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
        const { data: { session: storedSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (storedSession) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("User verification error:", userError);
            await supabase.auth.signOut();
            setSession(null);
            navigate("/auth");
            return;
          }

          if (user) {
            setSession(storedSession);
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        toast.error("Erreur d'initialisation de la session");
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
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        localStorage.clear();
        navigate("/auth");
      } else if (event === 'SIGNED_IN' && currentSession) {
        setSession(currentSession);
        toast.success("Connexion réussie");
        navigate("/dashboard");
      } else if (event === 'TOKEN_REFRESHED' && currentSession) {
        setSession(currentSession);
      } else if (event === 'USER_UPDATED' && currentSession) {
        setSession(currentSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { session, loading };
};