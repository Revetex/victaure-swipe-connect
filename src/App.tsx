import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { Loader } from "./components/ui/loader";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load pages with proper type annotations
const Auth = lazy(() => import("./pages/Auth").then((module: any) => ({
  default: module.default
})));

const Dashboard = lazy(() => import("./pages/Dashboard").then((module: any) => ({
  default: module.default
})));

// Loading fallback component with optimized animations
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative">
        <Loader className="w-10 h-10 text-primary" />
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Loader className="w-10 h-10 text-primary/30" />
        </motion.div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">
        Chargement...
      </p>
    </motion.div>
  </div>
);

function App() {
  const { isAuthenticated, isLoading, error } = useAuth();

  // Fix mobile viewport height
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // Cleanup
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Show error toast if authentication fails
  useEffect(() => {
    if (error) {
      toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
    }
  }, [error]);

  // Show loading state
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-[100vh] min-h-[calc(var(--vh,1vh)*100)] w-full overflow-y-auto">
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
                </motion.div>
              } 
            />
            
            <Route 
              path="/auth" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Auth />
                  </motion.div>
                )
              } 
            />
            
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            <Route 
              path="*" 
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
              } 
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;
