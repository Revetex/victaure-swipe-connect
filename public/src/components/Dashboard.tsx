import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "./DashboardLayout";
import { VCardCreationForm } from "./VCardCreationForm";
import { Loader } from "./ui/loader";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function Dashboard() {
  const navigate = useNavigate();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error("Erreur d'authentification");
          navigate('/auth');
          return;
        }

        if (!session) {
          console.log('No active session found');
          navigate('/auth');
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User data error:', userError);
          toast.error("Impossible d'accéder aux données utilisateur");
          await supabase.auth.signOut();
          navigate('/auth');
          return;
        }

        const { data: authData } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event);
          if (event === 'SIGNED_OUT' || !session) {
            navigate('/auth');
          }
        });

        authSubscription = {
          unsubscribe: () => {
            if (authData?.subscription) {
              authData.subscription.unsubscribe();
            }
          }
        };

        if (mounted) {
          setIsAuthChecking(false);
        }

      } catch (error) {
        console.error('Error checking auth status:', error);
        toast.error("Erreur lors de la vérification de l'authentification");
        navigate('/auth');
      }
    };

    checkAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (isAuthChecking || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader className="w-8 h-8 text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Vérification de vos accès...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return <VCardCreationForm />;
  }

  return <DashboardLayout />;
}