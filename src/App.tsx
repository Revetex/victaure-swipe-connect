import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { Loader } from "./components/ui/loader";
import { useEffect } from "react";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

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

  if (isLoading) {
    return (
      <div className="h-[100vh] h-[calc(var(--vh,1vh)*100)] w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Chargement de votre session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] min-h-[calc(var(--vh,1vh)*100)] w-full overflow-y-auto">
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Auth />
            )
          } 
        />
        
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route 
          path="*" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;