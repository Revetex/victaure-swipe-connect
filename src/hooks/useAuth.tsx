
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { handleAuthError, clearStorages } from "@/utils/authUtils";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string, redirectTo?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        toast.success("Connexion réussie !");
        
        // Redirect to the saved URL if available, otherwise to dashboard
        const savedRedirectTo = redirectTo || sessionStorage.getItem('redirectTo') || '/dashboard';
        sessionStorage.removeItem('redirectTo');
        navigate(savedRedirectTo);
      }
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      setError(error);
      toast.error(error.message === "Invalid login credentials" 
        ? "Identifiants invalides" 
        : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    fullName: string, 
    phone: string,
    redirectTo?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) throw error;

      if (data) {
        toast.success("Compte créé avec succès ! Un email de confirmation vous a été envoyé.");
        
        // Create profile for the user
        if (data.user) {
          // We'll let the DB trigger handle profile creation
          console.log("User created, profile will be created by database trigger");
        }

        // Redirect to login page or dashboard
        const savedRedirectTo = redirectTo || '/auth';
        navigate(savedRedirectTo);
      }
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      setError(error);
      toast.error(error.message === "User already registered" 
        ? "Cet email est déjà utilisé" 
        : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearStorages();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/auth");
      toast.success("Vous avez été déconnecté");
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Pour assurer la compatibilité avec l'ancien code qui utilise "logout"
  const logout = useCallback(async () => {
    return signOut();
  }, [signOut]);

  // Reload user data
  const refreshUser = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        handleAuthError(error as any, signOut);
      }
      return null;
    }
  }, [signOut]);

  return {
    user,
    isAuthenticated,
    isLoading,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    logout, // Ajouté pour la compatibilité
    refreshUser
  };
}
