import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BiometricAuth } from "@/components/auth/BiometricAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/Logo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-border/5 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <Logo className="h-8 w-auto" />
          <nav className="flex items-center gap-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Retour à l'accueil
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full py-8 px-4">
        <div className="container max-w-sm mx-auto space-y-8">
          {/* Header with Title */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Bienvenue sur Victaure</h1>
              <p className="text-sm text-muted-foreground">
                Connectez-vous ou créez un compte pour continuer
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="glass-card w-full space-y-6 rounded-xl border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
            <BiometricAuth />
            <AuthForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-border/5 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Dialog>
                <DialogTrigger className="text-sm text-muted-foreground hover:text-foreground/80 transition-colors">
                  Politique de confidentialité
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Politique de confidentialité</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-sm mt-4 text-muted-foreground">
                    <h2 className="text-foreground">1. Collecte des informations</h2>
                    <p>Nous collectons les informations suivantes :</p>
                    <ul>
                      <li>Nom et prénom</li>
                      <li>Adresse e-mail</li>
                      <li>Numéro de téléphone</li>
                      <li>Informations professionnelles</li>
                    </ul>

                    <h2 className="text-foreground">2. Utilisation des informations</h2>
                    <p>Les informations collectées sont utilisées pour :</p>
                    <ul>
                      <li>Personnaliser votre expérience</li>
                      <li>Améliorer notre service</li>
                      <li>Communiquer avec vous concernant votre compte</li>
                      <li>Vous proposer des offres d'emploi pertinentes</li>
                    </ul>

                    <h2 className="text-foreground">3. Protection des informations</h2>
                    <p>Nous mettons en œuvre des mesures de sécurité avancées pour protéger vos données personnelles.</p>

                    <h2 className="text-foreground">4. Vos droits</h2>
                    <p>Vous disposez des droits suivants :</p>
                    <ul>
                      <li>Droit d'accès à vos données</li>
                      <li>Droit de rectification</li>
                      <li>Droit à l'effacement</li>
                      <li>Droit à la portabilité</li>
                    </ul>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="text-sm text-muted-foreground hover:text-foreground/80 transition-colors">
                  Conditions d'utilisation
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Conditions d'utilisation</DialogTitle>
                  </DialogHeader>
                  <div className="prose prose-sm mt-4 text-muted-foreground">
                    <h2 className="text-foreground">1. Acceptation des conditions</h2>
                    <p>En utilisant Victaure, vous acceptez les présentes conditions d'utilisation.</p>

                    <h2 className="text-foreground">2. Services proposés</h2>
                    <p>Victaure propose :</p>
                    <ul>
                      <li>Une plateforme de mise en relation professionnelle</li>
                      <li>Des outils de gestion de carrière</li>
                      <li>Des services de recrutement innovants</li>
                    </ul>

                    <h2 className="text-foreground">3. Responsabilités</h2>
                    <p>Les utilisateurs s'engagent à :</p>
                    <ul>
                      <li>Fournir des informations exactes</li>
                      <li>Respecter la propriété intellectuelle</li>
                      <li>Ne pas avoir un comportement préjudiciable</li>
                    </ul>

                    <h2 className="text-foreground">4. Modifications</h2>
                    <p>Victaure se réserve le droit de modifier ces conditions à tout moment.</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Victaure. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}