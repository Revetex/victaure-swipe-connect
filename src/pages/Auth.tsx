import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User already logged in, redirecting to dashboard");
        navigate("/dashboard");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN' && session) {
        toast.success("Connexion réussie");
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md p-8 space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Logo size="lg" className="mb-2" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Bienvenue sur Victaure</h1>
            <p className="text-sm text-muted-foreground">
              Connectez-vous ou créez un compte pour continuer
            </p>
          </div>
        </div>

        <BiometricAuth />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              ou continuez avec
            </span>
          </div>
        </div>

        <AuthForm />
      </Card>
    </div>
  );
}