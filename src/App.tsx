import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        // Clear any stale session data
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("Error clearing session:", signOutError);
        }

        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Erreur de connexion");
          return;
        }

        if (currentSession) {
          // Verify the session is valid by attempting to refresh
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error("Session refresh error:", refreshError);
            toast.error("Session expirée, veuillez vous reconnecter");
            await supabase.auth.signOut();
            setSession(null);
            return;
          }
          setSession(currentSession);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        toast.error("Erreur d'initialisation de la session");
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event, currentSession);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        toast.info("Déconnexion effectuée");
      } else if (event === 'SIGNED_IN') {
        setSession(currentSession);
        toast.success("Connexion réussie");
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
        console.log("Token refreshed successfully");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
          <BrowserRouter>
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
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;