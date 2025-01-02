import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function BiometricAuth() {
  const navigate = useNavigate();
  const [biometricSupport, setBiometricSupport] = useState(false);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        if (!window.PublicKeyCredential) {
          console.log("WebAuthn API not available");
          return;
        }

        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        console.log("Biometric support:", available);
        setBiometricSupport(available);
      } catch (error) {
        console.error("Error checking biometric support:", error);
        toast.error("Erreur lors de la vérification du support biométrique");
      }
    };

    checkBiometricSupport();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      if (!window.PublicKeyCredential) {
        toast.error("L'authentification biométrique n'est pas supportée sur votre appareil");
        return;
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: "required" as UserVerificationRequirement,
        timeout: 60000,
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (credential) {
        // Pour la démo, nous utilisons un compte test
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email: "demo@example.com",
          password: "demopassword",
        });

        if (error) {
          console.error("Auth error:", error);
          toast.error("Erreur d'authentification biométrique");
          return;
        }

        if (session) {
          toast.success("Authentification biométrique réussie");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
      toast.error("Erreur lors de l'authentification biométrique");
    }
  };

  if (!biometricSupport) {
    return null;
  }

  return null;
}