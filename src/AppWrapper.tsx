
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AuthCallback } from "@/components/AuthCallback";
import { WalletPage } from "@/components/wallet/WalletPage";
import { useEffect } from "react";

// Créer une instance du client de requête avec une configuration optimisée
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function AppWrapper() {
  // Appliquer des styles globaux pour améliorer l'esthétique générale
  useEffect(() => {
    // Appliquer des styles de scrollbar améliorés
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Supprimer les styles globaux lors du nettoyage
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <PrivateRoute>
                  <WalletPage />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster 
            position="top-center" 
            richColors 
            closeButton 
            toastOptions={{
              duration: 5000,
              className: "backdrop-blur-sm border border-slate-200 dark:border-slate-700",
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
