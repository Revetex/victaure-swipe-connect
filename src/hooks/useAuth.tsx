
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { handleAuthError, clearStorages } from "@/utils/authUtils";

// Fonction utilitaire pour détecter les appareils mobiles
const detectMobileDevice = () => {
  return window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const isMobile = detectMobileDevice();

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
        console.info("Auth state changed:", event);
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

      // Configuration spécifique à la plateforme
      const options = {
        emailRedirectTo: window.location.origin + '/auth/callback',
        data: {
          device_type: isMobile ? 'mobile' : 'desktop'
        }
      };

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        toast.success(isMobile ? "Connexion réussie" : "Connexion réussie !");
        
        // Redirect to the saved URL if available, otherwise to dashboard
        const savedRedirectTo = redirectTo || sessionStorage.getItem('redirectTo') || '/dashboard';
        sessionStorage.removeItem('redirectTo');
        navigate(savedRedirectTo);
      }
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      setError(error);
      if (isMobile) {
        // Messages d'erreur simplifiés pour mobile
        toast.error(error.message === "Invalid login credentials" 
          ? "Identifiants incorrects" 
          : "Erreur de connexion");
      } else {
        toast.error(error.message === "Invalid login credentials" 
          ? "Identifiants invalides" 
          : "Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, isMobile]);

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

      // Configuration adaptée selon la plateforme
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            device_type: isMobile ? 'mobile' : 'desktop'
          },
          emailRedirectTo: window.location.origin + (isMobile ? '/auth/mobile-callback' : '/auth/callback')
        }
      });

      if (error) throw error;

      if (data) {
        toast.success(isMobile 
          ? "Compte créé ! Vérifiez votre email" 
          : "Compte créé avec succès ! Un email de confirmation vous a été envoyé.");
        
        // Redirection différente selon l'appareil
        const savedRedirectTo = redirectTo || '/auth';
        navigate(savedRedirectTo);
      }
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      setError(error);
      
      // Messages d'erreur adaptés
      if (error.message === "User already registered") {
        toast.error(isMobile 
          ? "Email déjà utilisé" 
          : "Cet email est déjà utilisé");
      } else {
        toast.error(isMobile 
          ? "Échec de l'inscription" 
          : "Erreur d'inscription");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, isMobile]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearStorages();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/auth");
      toast.success(isMobile ? "Déconnexion réussie" : "Vous avez été déconnecté");
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  }, [navigate, isMobile]);

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

  // Vérification de l'état d'authentification pour les applications mobiles
  const checkMobileAuth = useCallback(async () => {
    if (!isMobile) return { isAuthenticated: isAuthenticated };
    
    try {
      // Récupération de la session avec un timeout plus court pour mobile
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const { data, error } = await supabase.auth.getSession();
      clearTimeout(timeoutId);
      
      if (error) throw error;
      
      return {
        isAuthenticated: !!data.session,
        user: data.session?.user || null
      };
    } catch (error) {
      console.warn("Mobile auth check failed:", error);
      return { isAuthenticated: false, error };
    }
  }, [isMobile, isAuthenticated]);

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
    refreshUser,
    checkMobileAuth, // Nouvelle méthode spécifique pour mobile
    isMobile
  };
}
