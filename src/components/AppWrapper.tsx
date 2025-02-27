
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AuthCallback } from "@/components/AuthCallback";
import { useState, useEffect } from "react";
import { createContext } from "react";

// Créer un contexte pour gérer l'état de chargement global
export const AppContext = createContext({
  isLoading: true,
  setIsLoading: (loading: boolean) => {},
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un délai de chargement initial 
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContext.Provider value={{ isLoading, setIsLoading }}>
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
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast: "bg-background/95 text-foreground backdrop-blur-md border border-border rounded-lg shadow-lg",
                  title: "font-medium text-lg",
                  description: "text-muted-foreground",
                  actionButton: "bg-primary text-primary-foreground",
                  cancelButton: "bg-muted text-muted-foreground",
                  success: "border-green-500",
                  error: "border-red-500",
                  info: "border-blue-500",
                  warning: "border-yellow-500",
                }
              }}
            />
          </BrowserRouter>
        </AppContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
