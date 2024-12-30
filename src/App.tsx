import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useSessionManager } from "@/hooks/useSessionManager";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  const { session, loading } = useSessionManager();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;