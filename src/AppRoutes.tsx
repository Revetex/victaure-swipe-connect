
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import { TermsPage } from "@/components/legal/TermsPage";
import { PrivacyPage } from "@/components/legal/PrivacyPage";
import { CookiesPage } from "@/components/legal/CookiesPage";
import { LegalNoticePage } from "@/components/legal/LegalNoticePage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PublicProfile from "@/components/PublicProfile";
import { useAuth } from "@/hooks/useAuth";
import { NotesPage } from "@/components/tools/NotesPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { ChessPage } from "@/components/tools/ChessPage";
import { Feed } from "@/components/Feed";
import { DashboardLayout } from "@/components/DashboardLayout";

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to="/feed" replace />
          ) : (
            <Index />
          )
        } 
      />
      <Route 
        path="/auth" 
        element={
          isAuthenticated ? (
            <Navigate to="/feed" replace />
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
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/translator" element={<TranslatorPage />} />
        <Route path="/chess" element={<ChessPage />} />
      </Route>

      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            <Navigate to="/feed" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
    </Routes>
  );
}
