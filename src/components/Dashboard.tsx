import { useProfile } from "@/hooks/useProfile";
import { DashboardAuth } from "./dashboard/core/DashboardAuth";
import { DashboardLayout } from "./DashboardLayout";
import { VCardCreationForm } from "./VCardCreationForm";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect } from "react";
import { DashboardLoading } from "./dashboard/core/DashboardLoading";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardErrorBoundary } from "./dashboard/layout/DashboardErrorBoundary";

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

export function Dashboard() {
  const { profile, isLoading } = useProfile();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Simplified background for settings page */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] z-0" />
      
      {/* Content */}
      <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <DashboardLoading />
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
      </ErrorBoundary>
    </div>
  );
}