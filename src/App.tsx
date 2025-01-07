import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { Loader } from "./components/ui/loader";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
      toast.error("Erreur d'authentification. Veuillez vous reconnecter.");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-[100vh] min-h-[calc(var(--vh,1vh)*100)] w-full flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader className="h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">
            Chargement...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] min-h-[calc(var(--vh,1vh)*100)] w-full overflow-y-auto">
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
                <Navigate to="/auth" replace />
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Navigate to="/auth" replace />
              </motion.div>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;