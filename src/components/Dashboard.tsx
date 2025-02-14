
import { useProfile } from "@/hooks/useProfile";
import { DashboardAuth } from "./dashboard/core/DashboardAuth";
import { DashboardLayout } from "./DashboardLayout";
import { VCardCreationForm } from "./VCardCreationForm";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect, memo } from "react";
import { DashboardLoading } from "./dashboard/core/DashboardLoading";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardErrorBoundary } from "./dashboard/layout/DashboardErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

// Memoize the content components to prevent unnecessary re-renders
const MemoizedDashboardLayout = memo(DashboardLayout);
const MemoizedVCardCreationForm = memo(VCardCreationForm);
const MemoizedDashboardLoading = memo(DashboardLoading);

export function Dashboard() {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to auth");
      toast.error("Veuillez vous connecter pour accéder au tableau de bord");
      navigate("/auth");
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // Show loading state while checking auth and profile
  if (isAuthLoading || isProfileLoading) {
    return <MemoizedDashboardLoading />;
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 z-0" 
           style={{ willChange: 'transform' }} />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] z-0" 
           style={{ willChange: 'opacity' }} />
      
      <ErrorBoundary 
        FallbackComponent={DashboardErrorBoundary}
        onError={(error) => {
          console.error('Dashboard Error:', error);
          toast.error("Une erreur est survenue dans le tableau de bord");
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={profile ? 'dashboard' : 'create-profile'}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10"
            layoutId="dashboard-content"
          >
            {!profile ? (
              <MemoizedVCardCreationForm />
            ) : (
              <MemoizedDashboardLayout>
                <div className="p-4">
                  <h1 className="text-2xl font-bold">Tableau de bord</h1>
                  <p className="mt-2 text-gray-600">Bienvenue sur votre tableau de bord</p>
                </div>
              </MemoizedDashboardLayout>
            )}
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  );
}
