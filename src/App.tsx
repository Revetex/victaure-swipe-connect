import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useSessionManager } from "@/hooks/useSessionManager";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const { session, loading } = useSessionManager();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ne pas rendre l'application tant que le thème n'est pas monté
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <Routes>
            <Route
              path="/"
              element={
                session ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/auth"
              element={
                session ? <Navigate to="/dashboard" replace /> : <Auth />
              }
            />
            <Route
              path="/dashboard"
              element={
                session ? <Dashboard /> : <Navigate to="/auth" replace />
              }
            />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;