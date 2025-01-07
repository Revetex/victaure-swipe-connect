import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, error, isInitializing } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
      toast.error("Accès refusé. Veuillez vous reconnecter.");
    }
  }, [error]);

  // Show loading state while initializing or loading
  if (isInitializing || isLoading) {
    return (
      <div className="h-[calc(var(--vh,1vh)*100)] w-full flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <Loader className="w-8 h-8 text-primary" />
            <motion.div 
              className="absolute inset-0"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3] 
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Loader className="w-8 h-8 text-primary/20" />
            </motion.div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Vérification de vos accès...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted URL
    sessionStorage.setItem('redirectTo', location.pathname);
    
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Navigate to="/auth" replace state={{ from: location }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}