import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import { TermsPage } from "@/components/legal/TermsPage";
import { PrivacyPage } from "@/components/legal/PrivacyPage";
import { CookiesPage } from "@/components/legal/CookiesPage";
import { LegalNoticePage } from "@/components/legal/LegalNoticePage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PublicProfile from "@/components/PublicProfile";
import { useAuth } from "@/hooks/useAuth";
import { Marketplace } from "@/components/Marketplace";
import { ToolsPage } from "@/components/tools/ToolsPage";

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Index />
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
      <Route path="/legal/terms" element={<TermsPage />} />
      <Route path="/legal/privacy" element={<PrivacyPage />} />
      <Route path="/legal/cookies" element={<CookiesPage />} />
      <Route path="/legal/mentions" element={<LegalNoticePage />} />
      <Route path="/profile/:id" element={<PublicProfile />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <Marketplace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools"
        element={
          <ProtectedRoute>
            <ToolsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
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
  );
}