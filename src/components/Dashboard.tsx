
import { useProfile } from "@/hooks/useProfile";
import { DashboardAuth } from "./dashboard/core/DashboardAuth";
import { DashboardBlocks } from "./dashboard/blocks/DashboardBlocks";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect, memo } from "react";
import { DashboardLoading } from "./dashboard/core/DashboardLoading";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardErrorBoundary } from "./dashboard/layout/DashboardErrorBoundary";

// Memoize the content components to prevent unnecessary re-renders
const MemoizedDashboardBlocks = memo(DashboardBlocks);
const MemoizedDashboardLoading = memo(DashboardLoading);

export function Dashboard() {
  const { profile, isLoading } = useProfile();

  // Log performance metrics
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log(`Dashboard render time: ${endTime - startTime}ms`);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Optimized background with reduced opacity for better performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 z-0" 
           style={{ willChange: 'transform' }} />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] z-0" 
           style={{ willChange: 'opacity' }} />
      
      {/* Content */}
      <ErrorBoundary 
        FallbackComponent={DashboardErrorBoundary}
        onError={(error) => {
          console.error('Dashboard Error:', error);
          toast.error("Une erreur est survenue dans le tableau de bord");
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <MemoizedDashboardLoading />
          ) : (
            <motion.div
              key={profile ? 'dashboard' : 'auth'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {!profile ? (
                <DashboardAuth />
              ) : (
                <MemoizedDashboardBlocks />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  );
}
