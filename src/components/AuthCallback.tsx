
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader } from "./ui/loader";
import { supabase } from "@/integrations/supabase/client";

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true);
        
        // Vérifier si l'URL contient des paramètres d'erreur
        const url = new URL(window.location.href);
        const errorParam = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');
        
        if (errorParam || errorDescription) {
          throw new Error(errorDescription || "Erreur lors de l'authentification");
        }

        // Récupération de la session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur de session:", sessionError);
          throw new Error("Impossible de récupérer votre session");
        }

        if (!session) {
          console.error("Aucune session trouvée");
          throw new Error("Session non trouvée");
        }

        // Vérification de l'utilisateur
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Erreur de vérification utilisateur:", userError);
          throw new Error("Impossible de vérifier votre compte");
        }

        // Récupération du chemin de redirection
        const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
        sessionStorage.removeItem('redirectTo'); // Nettoyage

        // Notification et redirection
        toast.success("Connexion réussie !");
        navigate(redirectTo, { replace: true });
      } catch (error) {
        console.error("Erreur de callback:", error);
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
        toast.error("Échec de l'authentification");
        setTimeout(() => navigate('/auth', { replace: true }), 2000);
      } finally {
        setIsLoading(false);
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
        className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
      >
        <div className="max-w-md w-full space-y-4 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <button 
            onClick={() => navigate('/auth')}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Retour à la page de connexion
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
    >
      <div className="space-y-4 text-center">
        <Loader className="w-8 h-8 text-primary mx-auto" />
        <p className="text-muted-foreground animate-pulse">
          {isLoading ? "Vérification de votre identité..." : "Redirection en cours..."}
        </p>
      </div>
    </motion.div>
  );
}
