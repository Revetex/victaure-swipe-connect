import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session?.user) {
          console.log("User already logged in, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur lors de la vérification de l'authentification");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting to dashboard");
        toast.success("Connexion réussie");
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-y-auto">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-dashboard-pattern opacity-5 pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative w-full py-8 px-4">
        <div className="container max-w-sm mx-auto space-y-8">
          <AuthHeader />
          <AuthCard />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full"
          >
            <AuthVideo />
          </motion.div>
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}