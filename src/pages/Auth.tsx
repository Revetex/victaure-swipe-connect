import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if there's a stored session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session) {
          // Verify the session is still valid by getting the user
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("User verification error:", userError);
            // Clear invalid session
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
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dashboard-pattern opacity-5" />
      
      {/* Content */}
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-8">
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
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/50 px-2 text-muted-foreground backdrop-blur-sm">
                  ou continuez avec
                </span>
              </div>
            </div>

            {/* Auth Form */}
            <AuthForm />
          </div>

          {/* Advertisement */}
          <div className="mt-8 w-full max-w-sm mx-auto">
            <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src="/lovable-uploads/a1c77b1c-dd3c-45fc-b11c-70785ef9c63c.png" 
                alt="Advertisement" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}