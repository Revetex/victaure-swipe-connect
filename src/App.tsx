import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route 
        path="/auth" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />
        } 
      />
      <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
      <Route path="/conditions-utilisation" element={<TermsOfService />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;