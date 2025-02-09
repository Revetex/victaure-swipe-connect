
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
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
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/Settings";
import { Messages } from "@/components/messages/Messages";

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
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
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
      
      {/* Tools Routes */}
      <Route
        path="/tools"
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools/calculator"
        element={
          <ProtectedRoute>
            <CalculatorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools/translator"
        element={
          <ProtectedRoute>
            <TranslatorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools/chess"
        element={
          <ProtectedRoute>
            <ChessPage />
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
