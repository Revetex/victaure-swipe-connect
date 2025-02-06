
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader } from "./ui/loader";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get session from URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Erreur de récupération de session");
        }

        if (!session) {
          throw new Error("Aucune session trouvée");
        }

        // Verify the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User verification error:", userError);
          throw new Error("Erreur de vérification utilisateur");
        }

        // Get redirect path with fallback
        const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
        sessionStorage.removeItem('redirectTo'); // Clean up

        // Success notification and redirect
        toast.success("Connexion réussie");
        navigate(redirectTo, { replace: true });
      } catch (error) {
        console.error("Auth callback error:", error);
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
        toast.error("Erreur d'authentification");
        navigate('/auth', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen gap-4 p-4"
      >
        <p className="text-destructive text-center">{error}</p>
        <button 
          onClick={() => navigate('/auth')}
          className="text-primary hover:underline transition-colors"
        >
          Retour à la page de connexion
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen gap-4 p-4"
    >
      <Loader className="w-8 h-8 text-primary animate-spin" />
      <p className="text-muted-foreground animate-pulse text-center">
        Redirection en cours...
      </p>
    </motion.div>
  );
}
