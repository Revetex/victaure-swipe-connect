import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { Loader } from "./components/ui/loader";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

const loaderVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function App() {
  const { isAuthenticated, isLoading, error } = useAuth();
  
  // Fix mobile viewport height on iOS
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

  // Show error toast if authentication fails
  useEffect(() => {
    if (error) {
      toast.error("Erreur d'authentification. Veuillez vous reconnecter.", {
        duration: 5000,
      });
      console.error("Auth error:", error);
    }
  }, [error]);

  // Loading state with enhanced animation
  if (isLoading) {
    return (
      <div className="h-[100vh] h-[calc(var(--vh,1vh)*100)] w-full flex items-center justify-center bg-background">
        <motion.div 
          variants={loaderVariants}
          initial="initial"
          animate="animate"
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
            Préparation de votre tableau de bord...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] min-h-[calc(var(--vh,1vh)*100)] w-full overflow-y-auto">
      <AnimatePresence mode="wait" initial={false}>
        <Routes>
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

          <Route 
            path="*" 
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
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;