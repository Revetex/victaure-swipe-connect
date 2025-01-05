import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { Checkbox } from "@/components/ui/checkbox";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session?.user) {
          console.log("User already logged in, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Erreur lors de la vérification de l'authentification");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
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

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-y-auto">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-dashboard-pattern opacity-5 pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative w-full py-8 px-4">
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
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="h-3 w-3 md:h-4 md:w-4" // Adjusted size for mobile
              />
              <label 
                htmlFor="rememberMe" 
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Rester connecté
              </label>
            </div>
          </div>

          {/* Video Section */}
          <div className="w-full">
            <AuthVideo />
          </div>

          {/* Legal Links - Centered */}
          <div className="text-center text-sm pb-8 space-y-4">
            <div className="flex justify-center space-x-4">
              <Dialog>
                <DialogTrigger className="text-muted-foreground hover:text-foreground/80 transition-colors">
                  Politique de confidentialité
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Politique de confidentialité</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-sm mt-4 text-muted-foreground">
                    <h2 className="text-foreground">1. Collecte des informations</h2>
                    <p>Nous collectons les informations suivantes :</p>
                    <ul className="text-muted-foreground">
                      <li>Nom et prénom</li>
                      <li>Adresse e-mail</li>
                      <li>Numéro de téléphone</li>
                      <li>Informations professionnelles</li>
                    </ul>

                    <h2 className="text-foreground">2. Utilisation des informations</h2>
                    <p>Les informations collectées sont utilisées pour :</p>
                    <ul className="text-muted-foreground">
                      <li>Personnaliser l'expérience utilisateur</li>
                      <li>Améliorer notre service</li>
                      <li>Communiquer avec vous concernant votre compte</li>
                    </ul>

                    <h2 className="text-foreground">3. Protection des informations</h2>
                    <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.</p>

                    <h2 className="text-foreground">4. Cookies</h2>
                    <p>Nous utilisons des cookies pour améliorer l'expérience utilisateur et analyser notre trafic.</p>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="text-muted-foreground hover:text-foreground/80 transition-colors">
                  Conditions d'utilisation
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Conditions d'utilisation</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-sm mt-4 text-muted-foreground">
                    <h2 className="text-foreground">1. Acceptation des conditions</h2>
                    <p>En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>

                    <h2 className="text-foreground">2. Licence d'utilisation</h2>
                    <p>Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site.</p>

                    <h2 className="text-foreground">3. Compte utilisateur</h2>
                    <p>Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe.</p>

                    <h2 className="text-foreground">4. Limitations de responsabilité</h2>
                    <p>Nous ne serons pas tenus responsables des dommages directs, indirects, accessoires ou consécutifs.</p>

                    <h2 className="text-foreground">5. Modifications du service</h2>
                    <p>Nous nous réservons le droit de modifier ou d'interrompre le service sans préavis.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-muted-foreground">
              © {new Date().getFullYear()} Victaure. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}