import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "./ui/loader";
import { toast } from "sonner";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          toast.error("Erreur d'authentification");
          setIsAuthenticated(false);
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("User verification error:", userError);
          toast.error("Erreur de vérification utilisateur");
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur de vérification de session");
        setIsAuthenticated(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
      }
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted URL
    sessionStorage.setItem('redirectTo', location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}