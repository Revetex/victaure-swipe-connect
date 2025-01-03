import { AuthForm } from "@/components/auth/AuthForm";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Auth() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo size="lg" className="mb-2" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenue sur Victaure
          </h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous ou créez un compte pour continuer
          </p>
        </div>

        <div className="glass-card p-6 rounded-lg shadow-lg">
          <AuthForm />
        </div>
        
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          <AuthVideo />
        </div>

        <div className="text-center text-sm text-muted-foreground space-x-2">
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

        <div className="text-center text-sm text-muted-foreground">
          © 2025 Victaure. Tous droits réservés.
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowTerms(false)}
              className="absolute right-4 top-4 p-2 hover:bg-accent rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Conditions d'utilisation</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-2">1. Acceptation des conditions</h3>
                  <p className="text-muted-foreground">
                    En accédant à ce site, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">2. Licence d'utilisation</h3>
                  <p className="text-muted-foreground">
                    Une licence limitée, non exclusive et non transférable vous est accordée pour accéder et utiliser le site.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">3. Compte utilisateur</h3>
                  <p className="text-muted-foreground">
                    Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">4. Limitations de responsabilité</h3>
                  <p className="text-muted-foreground">
                    Nous ne serons pas tenus responsables des dommages directs, indirects, accessoires ou consécutifs.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">5. Modifications du service</h3>
                  <p className="text-muted-foreground">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="absolute right-4 top-4 p-2 hover:bg-accent rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Politique de confidentialité</h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-2">1. Collecte des informations</h3>
                  <p className="text-muted-foreground mb-2">Nous collectons les informations suivantes :</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Nom et prénom</li>
                    <li>Adresse e-mail</li>
                    <li>Numéro de téléphone</li>
                    <li>Informations professionnelles</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">2. Utilisation des informations</h3>
                  <p className="text-muted-foreground mb-2">Les informations collectées sont utilisées pour :</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Personnaliser l'expérience utilisateur</li>
                    <li>Améliorer notre service</li>
                    <li>Communiquer avec vous concernant votre compte</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">3. Protection des informations</h3>
                  <p className="text-muted-foreground">
                    Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">4. Cookies</h3>
                  <p className="text-muted-foreground">
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