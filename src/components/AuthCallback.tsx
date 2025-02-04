import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader } from "./ui/loader";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
    sessionStorage.removeItem('redirectTo'); // Clean up
    
    toast.success("Connexion réussie");
    navigate(redirectTo, { replace: true });
  }, [navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen gap-4"
    >
      <Loader className="w-8 h-8 text-primary" />
      <p className="text-muted-foreground animate-pulse">
        Redirection en cours...
      </p>
    </motion.div>
  );
}