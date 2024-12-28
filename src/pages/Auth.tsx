import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserRound, Fingerprint } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [biometricSupport, setBiometricSupport] = useState(false);

  useEffect(() => {
    // Check if the browser supports biometric authentication
    const checkBiometricSupport = async () => {
      try {
        if (window.PublicKeyCredential) {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricSupport(available);
          console.log("Biometric support:", available);
        }
      } catch (error) {
        console.error("Error checking biometric support:", error);
      }
    };

    checkBiometricSupport();

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
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleBiometricAuth = async () => {
    try {
      // Create a random challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Request biometric authentication
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          userVerification: "required",
          timeout: 60000, // 1 minute timeout
        },
      });

      if (credential) {
        // Here you would typically validate the credential with your backend
        // For demo purposes, we'll simulate a successful authentication
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email: "demo@example.com", // This is just for demo purposes
          password: "demopassword",
        });

        if (error) {
          console.error("Auth error:", error);
          toast.error("Erreur d'authentification");
          return;
        }

        if (session) {
          toast.success("Authentification biométrique réussie");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
      toast.error("Erreur d'authentification biométrique");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Bienvenue</h1>
          <p className="text-muted-foreground">
            Connectez-vous ou créez un compte pour continuer
          </p>
        </div>

        {biometricSupport && (
          <div className="flex gap-2 justify-center mb-6">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleBiometricAuth}
            >
              <UserRound className="h-4 w-4" />
              <span>Face ID</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleBiometricAuth}
            >
              <Fingerprint className="h-4 w-4" />
              <span>Touch ID</span>
            </Button>
          </div>
        )}

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