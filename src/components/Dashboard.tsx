import { useProfile } from "@/hooks/useProfile";
import { DashboardAuth } from "./dashboard/core/DashboardAuth";
import { DashboardLayout } from "./DashboardLayout";
import { VCardCreationForm } from "./VCardCreationForm";
import { motion, AnimatePresence } from "framer-motion";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useEffect } from "react";

const pageVariants = {
  initial: { 
    opacity: 0,
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.4,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const loadingVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

export function Dashboard() {
  const { profile, isLoading: isProfileLoading, error } = useProfile();

  useEffect(() => {
    if (error) {
      console.error("Profile loading error:", error);
      toast.error("Une erreur est survenue lors du chargement de votre profil");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] z-0" />
      
      {/* Content */}
      <AnimatePresence mode="wait">
        {isProfileLoading ? (
          <motion.div
            key="loading"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center min-h-screen"
          >
            <ReloadIcon className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Chargement de votre profil...</p>
          </motion.div>
        ) : (
          <motion.div
            key={profile ? 'dashboard' : 'auth'}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10"
          >
            {!profile ? (
              <VCardCreationForm />
            ) : (
              <DashboardLayout />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}