import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserRound, Fingerprint } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function BiometricAuth() {
  const navigate = useNavigate();
  const [biometricSupport, setBiometricSupport] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleBiometricAuth = async () => {
    try {
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
        // For demo purposes only - in production, validate credentials properly
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
      toast.error("Erreur d'authentification biométrique");
    }
  };

  if (!biometricSupport) return null;

  return (
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
  );
}