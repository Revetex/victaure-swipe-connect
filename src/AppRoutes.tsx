
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";

// Lazy load route components
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Feed = lazy(() => import("@/components/Feed").then(module => ({ default: module.Feed })));
const TermsPage = lazy(() => import("@/components/legal/TermsPage").then(module => ({ default: module.TermsPage })));
const PrivacyPage = lazy(() => import("@/components/legal/PrivacyPage").then(module => ({ default: module.PrivacyPage })));
const CookiesPage = lazy(() => import("@/components/legal/CookiesPage").then(module => ({ default: module.CookiesPage })));
const LegalNoticePage = lazy(() => import("@/components/legal/LegalNoticePage").then(module => ({ default: module.LegalNoticePage })));
const PublicProfile = lazy(() => import("@/components/PublicProfile"));
const NotesPage = lazy(() => import("@/components/tools/NotesPage").then(module => ({ default: module.NotesPage })));
const TasksPage = lazy(() => import("@/components/tools/TasksPage").then(module => ({ default: module.TasksPage })));
const CalculatorPage = lazy(() => import("@/components/tools/CalculatorPage").then(module => ({ default: module.CalculatorPage })));
const TranslatorPage = lazy(() => import("@/components/tools/TranslatorPage").then(module => ({ default: module.TranslatorPage })));
const ChessPage = lazy(() => import("@/components/tools/ChessPage").then(module => ({ default: module.ChessPage })));

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader className="w-8 h-8 text-primary" />
    </div>
  );
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/feed" replace /> : <Index />} 
        />
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/feed" replace /> : <Auth />} 
        />
        
        {/* Legal routes */}
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/legal/privacy" element={<PrivacyPage />} />
        <Route path="/legal/cookies" element={<CookiesPage />} />
        <Route path="/legal/mentions" element={<LegalNoticePage />} />
        
        {/* Public profile route */}
        <Route path="/profile/:id" element={<PublicProfile />} />

        {/* Protected routes */}
        <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/auth" replace />} />
        <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} />
        <Route path="/notes" element={isAuthenticated ? <NotesPage /> : <Navigate to="/auth" replace />} />
        <Route path="/tasks" element={isAuthenticated ? <TasksPage /> : <Navigate to="/auth" replace />} />
        <Route path="/calculator" element={isAuthenticated ? <CalculatorPage /> : <Navigate to="/auth" replace />} />
        <Route path="/translator" element={isAuthenticated ? <TranslatorPage /> : <Navigate to="/auth" replace />} />
        <Route path="/chess" element={isAuthenticated ? <ChessPage /> : <Navigate to="/auth" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/feed" : "/auth"} replace />} />
      </Routes>
    </Suspense>
  );
}
