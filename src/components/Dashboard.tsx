import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "./DashboardLayout";
import { VCardCreationForm } from "./VCardCreationForm";
import { Loader } from "./ui/loader";
import { toast } from "sonner";

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
          navigate('/auth');
          return;
        }

        if (!session) {
          console.log('No active session found');
          toast.error("Session expirée. Veuillez vous reconnecter.");
          navigate('/auth');
          return;
        }

        // Verify the user data can be accessed
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User data error:', userError);
          toast.error("Impossible d'accéder aux données utilisateur. Veuillez vous reconnecter.");
          await supabase.auth.signOut();
          navigate('/auth');
          return;
        }

        if (!user) {
          console.error('No user data found');
          toast.error("Données utilisateur introuvables. Veuillez vous reconnecter.");
          navigate('/auth');
          return;
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            if (event === 'SIGNED_OUT' || !session) {
              navigate('/auth');
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed successfully');
            }
          }
        );

        if (mounted) {
          setIsAuthChecking(false);
        }

        return () => {
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error('Error checking auth status:', error);
        toast.error("Erreur lors de la vérification de l'authentification");
        navigate('/auth');
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (isAuthChecking || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (!profile) {
    return <VCardCreationForm />;
  }

  return <DashboardLayout />;
}