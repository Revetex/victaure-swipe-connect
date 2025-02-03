import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import { AuthCallback } from "@/components/AuthCallback";
import { PrivateRoute } from "@/components/PrivateRoute";
import { VCardStyleProvider } from "@/components/vcard/VCardStyleContext";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <VCardStyleProvider>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
        } />
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />
        } />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster />
    </VCardStyleProvider>
  );
}