import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "./dashboard/DashboardLayout";
import { VCardCreationForm } from "./VCardCreationForm";
import { Loader } from "./ui/loader";
import { toast } from "sonner";

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          toast.error("Erreur d'authentification");
          navigate('/auth');
          return;
        }

        if (!session) {
          console.log('No active session found');
          navigate('/auth');
          return;
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            if (event === 'SIGNED_OUT' || !session) {
              navigate('/auth');
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };

      } catch (error) {
        console.error('Error checking auth status:', error);
        toast.error("Erreur lors de la vérification de l'authentification");
        navigate('/auth');
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
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