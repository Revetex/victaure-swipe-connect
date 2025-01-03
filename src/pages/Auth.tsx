import { AuthForm } from "@/components/auth/AuthForm";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { X } from "lucide-react";
import { useState } from "react";

export default function Auth() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left Side - Video */}
      <div className="relative w-full md:w-1/2 h-[300px] md:h-screen">
        <AuthVideo />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Logo size="xl" className="w-32 h-32 drop-shadow-lg" />
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 min-h-[calc(100vh-300px)] md:min-h-screen flex flex-col justify-between p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          <div className="text-center space-y-2 animate-fadeIn">
            <h1 className="text-3xl font-bold tracking-tight font-playfair">
              Bienvenue sur Victaure
            </h1>
            <p className="text-base text-muted-foreground font-light">
              Connectez-vous ou créez un compte pour continuer
            </p>
          </div>

          <div className="glass-card p-8 animate-slideUp">
            <AuthForm />
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-muted-foreground space-x-2">
            <button 
              onClick={() => setShowPrivacy(true)} 
              className="hover:text-primary transition-colors"
            >
              Politique de confidentialité
            </button>
            <span>•</span>
            <button 
              onClick={() => setShowTerms(true)} 
              className="hover:text-primary transition-colors"
            >
              Conditions d'utilisation
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Victaure. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-background/95 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative shadow-xl border border-border/50">
            <button 
              onClick={() => setShowTerms(false)}
              className="absolute right-4 top-4 p-2 hover:bg-accent rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 font-playfair">Conditions d'utilisation</h2>
              
              <div className="prose prose-sm dark:prose-invert">
                <section>
                  <h3>1. Acceptation des conditions</h3>
                  <p>
                    En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.
                  </p>
                </section>

                <section>
                  <h3>2. Licence d'utilisation</h3>
                  <p>
                    Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site.
                  </p>
                </section>

                <section>
                  <h3>3. Compte utilisateur</h3>
                  <p>
                    Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe.
                  </p>
                </section>

                <section>
                  <h3>4. Limitations de responsabilité</h3>
                  <p>
                    Nous ne serons pas tenus responsables des dommages directs, indirects, accessoires ou consécutifs.
                  </p>
                </section>

                <section>
                  <h3>5. Modifications du service</h3>
                  <p>
                    Nous nous réservons le droit de modifier ou d'interrompre le service sans préavis.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-background/95 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative shadow-xl border border-border/50">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="absolute right-4 top-4 p-2 hover:bg-accent rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 font-playfair">Politique de confidentialité</h2>
              
              <div className="prose prose-sm dark:prose-invert">
                <section>
                  <h3>1. Collecte des informations</h3>
                  <p>Nous collectons les informations suivantes :</p>
                  <ul>
                    <li>Nom et prénom</li>
                    <li>Adresse e-mail</li>
                    <li>Numéro de téléphone</li>
                    <li>Informations professionnelles</li>
                  </ul>
                </section>

                <section>
                  <h3>2. Utilisation des informations</h3>
                  <p>Les informations collectées sont utilisées pour :</p>
                  <ul>
                    <li>Personnaliser l'expérience utilisateur</li>
                    <li>Améliorer notre service</li>
                    <li>Communiquer avec vous concernant votre compte</li>
                  </ul>
                </section>

                <section>
                  <h3>3. Protection des informations</h3>
                  <p>
                    Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.
                  </p>
                </section>

                <section>
                  <h3>4. Cookies</h3>
                  <p>
                    Nous utilisons des cookies pour améliorer l'expérience utilisateur et analyser notre trafic.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
