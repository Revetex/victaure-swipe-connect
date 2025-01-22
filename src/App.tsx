import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { Loader } from "./components/ui/loader";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// Composant de chargement optimisé
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative">
        <Loader className="w-12 h-12 text-primary" />
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Loader className="w-12 h-12 text-primary/30" />
        </motion.div>
      </div>
      <p className="text-base text-muted-foreground animate-pulse">
        Chargement en cours...
      </p>
    </motion.div>
  </div>
);

function App() {
  const { isAuthenticated, isLoading, error } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Gestion optimisée des erreurs
  useEffect(() => {
    if (error) {
      console.error("Auth error:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.", {
        duration: 5000,
      });
    }
  }, [error]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-background">
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location} key={location.pathname}>
            <Route 
              path="/" 
              element={
                <motion.div
                  variants={pageTransitionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/auth" replace />
                  )}
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
                    variants={pageTransitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
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
                    variants={pageTransitionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <Dashboard />
                  </motion.div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default App;
