
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthCallback } from "@/components/AuthCallback";
import { JobsPage } from "@/components/jobs/JobsPage";
import { LegalNoticePage } from "@/components/legal/LegalNoticePage";
import { PrivacyPage } from "@/components/legal/PrivacyPage";
import { CookiesPage } from "@/components/legal/CookiesPage";
import TermsPage from "@/pages/legal/TermsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Jobs routes */}
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
      
      <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Legal routes */}
      <Route path="/legal" element={<LegalNoticePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  );
}
