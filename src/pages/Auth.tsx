import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";
import { AuthVideo } from "@/components/auth/AuthVideo";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("User verification error:", userError);
            await supabase.auth.signOut();
            return;
          }

          if (user) {
            console.log("User already logged in, redirecting to dashboard");
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur lors de la vérification de l'authentification");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        toast.success("Connexion réussie");
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="h-screen w-full overflow-y-auto bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-dashboard-pattern opacity-5 pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative w-full min-h-full py-8 px-4">
        <div className="container max-w-sm mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <Logo size="lg" className="mb-2" />
            <h1 className="text-2xl font-bold tracking-tight">Bienvenue sur Victaure</h1>
            <p className="text-sm text-muted-foreground">
              Connectez-vous ou créez un compte pour continuer
            </p>
          </div>

          {/* Auth Card */}
          <div className="glass-card w-full space-y-6 rounded-xl border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
            <BiometricAuth />
            <AuthForm />
          </div>

          {/* Video Section */}
          <div className="w-full">
            <AuthVideo />
          </div>

          {/* Legal Links */}
          <div className="text-center text-sm text-muted-foreground pb-8">
            <div className="space-x-2">
              <a href="/privacy" className="hover:text-primary hover:underline">
                Politique de confidentialité
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-primary hover:underline">
                Conditions d'utilisation
              </a>
            </div>
            <div className="mt-2">
              © {new Date().getFullYear()} Victaure. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}