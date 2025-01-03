import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    <div className="min-h-screen w-full bg-background overflow-y-auto">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-dashboard-pattern opacity-5 pointer-events-none" />
      
      {/* Main Content Container */}
      <div className="container max-w-sm mx-auto py-8 px-4 space-y-8">
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
        <div className="w-full mb-8">
          <AuthVideo />
        </div>

        {/* Legal Links */}
        <div className="text-center text-sm text-muted-foreground pb-8">
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger className="hover:text-primary hover:underline">
                Politique de confidentialité
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Politique de confidentialité</DialogTitle>
                </DialogHeader>
                <div className="prose prose-sm mt-4">
                  <h2>1. Collecte des informations</h2>
                  <p>Nous collectons les informations suivantes :</p>
                  <ul>
                    <li>Nom et prénom</li>
                    <li>Adresse e-mail</li>
                    <li>Numéro de téléphone</li>
                    <li>Informations professionnelles</li>
                  </ul>

                  <h2>2. Utilisation des informations</h2>
                  <p>Les informations collectées sont utilisées pour :</p>
                  <ul>
                    <li>Personnaliser l'expérience utilisateur</li>
                    <li>Améliorer notre service</li>
                    <li>Communiquer avec vous concernant votre compte</li>
                  </ul>

                  <h2>3. Protection des informations</h2>
                  <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.</p>

                  <h2>4. Cookies</h2>
                  <p>Nous utilisons des cookies pour améliorer l'expérience utilisateur et analyser notre trafic.</p>
                </div>
              </DialogContent>
            </Dialog>
            <span>•</span>
            <Dialog>
              <DialogTrigger className="hover:text-primary hover:underline">
                Conditions d'utilisation
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Conditions d'utilisation</DialogTitle>
                </DialogHeader>
                <div className="prose prose-sm mt-4">
                  <h2>1. Acceptation des conditions</h2>
                  <p>En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.</p>

                  <h2>2. Licence d'utilisation</h2>
                  <p>Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site.</p>

                  <h2>3. Compte utilisateur</h2>
                  <p>Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe.</p>

                  <h2>4. Limitations de responsabilité</h2>
                  <p>Nous ne serons pas tenus responsables des dommages directs, indirects, accessoires ou consécutifs.</p>

                  <h2>5. Modifications du service</h2>
                  <p>Nous nous réservons le droit de modifier ou d'interrompre le service sans préavis.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-2">
            © {new Date().getFullYear()} Victaure. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
}