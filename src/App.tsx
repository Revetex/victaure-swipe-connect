import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { LoadingScreen } from "./components/ui/loading-screen";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/layout/page-transition";

const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

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
                <PageTransition>
                  {isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/auth" replace />
                  )}
                </PageTransition>
              } 
            />
            
            <Route 
              path="/auth" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <PageTransition>
                    <Auth />
                  </PageTransition>
                )
              } 
            />
            
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
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