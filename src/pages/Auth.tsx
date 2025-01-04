import { AuthForm } from "@/components/auth/AuthForm";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Logo } from "@/components/Logo";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <div className="min-h-[100vh] min-h-[100dvh] w-full flex flex-col items-center px-4 py-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dashboard-pattern bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="w-full flex justify-center mb-8">
          <Logo size="lg" className="w-24 h-24" />
        </div>

        {/* Welcome Text */}
        <div className="w-full text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Bienvenue sur Victaure
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Connectez-vous ou créez un compte pour continuer
          </p>
        </div>

        {/* Auth Form */}
        <div className="w-full mb-12">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-gray-200/20 dark:border-gray-700/20">
            <AuthForm />
          </div>
        </div>

        {/* Video Section */}
        <div className="w-full max-w-2xl mb-12">
          <AuthVideo />
        </div>

        {/* Footer */}
        <div className="w-full text-center space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 space-x-2">
            <button 
              onClick={() => setShowPrivacy(true)}
              className="hover:text-cyan-500 transition-colors"
            >
              Politique de confidentialité
            </button>
            <span>•</span>
            <button
              onClick={() => setShowTerms(true)}
              className="hover:text-cyan-500 transition-colors"
            >
              Conditions d'utilisation
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Victaure. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative animate-fade-in">
            <button 
              onClick={() => setShowTerms(false)}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Conditions d'utilisation</h2>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto relative animate-fade-in">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Politique de confidentialité</h2>
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