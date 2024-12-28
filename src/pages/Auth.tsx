import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing session data on mount
    const clearSession = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error clearing session:", error);
      }
    };
    
    clearSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        toast.success("Connexion réussie");
        navigate("/dashboard", { replace: true });
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Bienvenue</h1>
          <p className="text-muted-foreground">
            Connectez-vous ou créez un compte pour continuer
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0369a1',
                  brandAccent: '#0284c7',
                },
              },
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Mot de passe",
                button_label: "Se connecter",
                email_input_placeholder: "Votre adresse email",
                password_input_placeholder: "Votre mot de passe",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Mot de passe",
                button_label: "S'inscrire",
                email_input_placeholder: "Votre adresse email",
                password_input_placeholder: "Choisissez un mot de passe",
              },
            },
          }}
        />
      </div>
    </div>
  );
}