
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

// Create query client with optimized configuration
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
  // Apply global styles to enhance aesthetics
  useEffect(() => {
    // Apply improved scrollbar styles
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add subtle transition to all elements
    const style = document.createElement('style');
    style.textContent = `
      * {
        transition-property: background-color, border-color, color, fill, stroke;
        transition-duration: 200ms;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up styles on unmount
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.head.removeChild(style);
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
              className: "backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-lg shadow-lg",
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
