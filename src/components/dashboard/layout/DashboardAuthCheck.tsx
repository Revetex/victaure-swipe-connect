
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardLoading } from "./DashboardLoading";

interface DashboardAuthCheckProps {
  children: React.ReactNode;
}

export function DashboardAuthCheck({ children }: DashboardAuthCheckProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No session found, redirecting to auth");
          toast.error("Veuillez vous connecter pour accéder au tableau de bord");
          navigate("/auth");
          return;
        }

        // Log session for debugging
        console.log("Active session found:", session.user.id);

        // Record session activity
        const { error: updateError } = await supabase
          .from('auth_sessions')
          .upsert({
            user_id: session.user.id,
            last_seen_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        if (updateError) {
          console.error("Error updating session activity:", updateError);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur lors de la vérification de l'authentification");
        navigate("/auth");
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (!session) {
        navigate("/auth");
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return <DashboardLoading />;
  }

  return <>{children}</>;
}
