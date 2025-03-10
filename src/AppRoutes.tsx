
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AuthCallback } from "@/components/AuthCallback";

// Page Loading Component
import { Loader } from "@/components/ui/loader";

// Lazy loaded pages
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Index = lazy(() => import("@/pages/Index"));
const TermsPage = lazy(() => import("@/pages/legal/TermsPage"));
/* Autres importations de pages */

// Loading Fallback
const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader className="w-6 h-6 text-primary" />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/terms" element={<TermsPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Ajoutez d'autres routes protégées ici */}
        
        {/* 404 route - leave at the bottom */}
        <Route path="*" element={<div>Page introuvable</div>} />
      </Routes>
    </Suspense>
  );
}
