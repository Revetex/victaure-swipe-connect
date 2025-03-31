
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "./ui/loader";
import { useAuth } from "@/context/AuthContext";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Detect if on mobile for UX optimizations
  const isMobile = window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isLoading) {
    return (
      <div className="h-[100vh] h-[calc(var(--vh,1vh)*100)] w-full flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.2 : 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <Loader className="w-8 h-8 text-primary" />
            {!isMobile && (
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
            )}
          </div>
          <p className={`text-sm text-muted-foreground ${isMobile ? '' : 'animate-pulse'}`}>
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
        transition={{ duration: isMobile ? 0.1 : 0.2 }}
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
      transition={{ duration: isMobile ? 0.2 : 0.3 }}
    >
      {children}
    </motion.div>
  );
}
