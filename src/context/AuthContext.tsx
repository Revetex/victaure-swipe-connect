
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { handleAuthError, clearStorages } from '@/utils/authUtils';

interface AuthContextType {
  user: any;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string, redirectTo?: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string, redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Detect mobile devices for optimized UI/UX
  const isMobile = window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        setSession(session);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
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
        setSession(session);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, redirectTo?: string) => {
    try {
      setLoading(true);
      setError(null);

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
      
      toast.error(error.message === "Invalid login credentials" 
        ? (isMobile ? "Identifiants incorrects" : "Identifiants invalides")
        : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
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
        
        const savedRedirectTo = redirectTo || '/auth';
        navigate(savedRedirectTo);
      }
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      setError(error);
      
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
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearStorages();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      navigate("/auth");
      toast.success(isMobile ? "Déconnexion réussie" : "Vous avez été déconnecté");
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  };

  // Reload user data
  const refreshUser = async () => {
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
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      isLoading,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
