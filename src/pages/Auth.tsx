import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthContent } from "@/components/auth/AuthContent";
import { AuthModal } from "@/components/auth/AuthModals";

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
      
      {/* Main Content */}
      <div className="relative z-10">
        <AuthContent />

        {/* Footer */}
        <div className="w-full text-center space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 space-x-2">
            <Link 
              to="/privacy-policy"
              className="hover:text-cyan-500 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <span>•</span>
            <Link
              to="/terms-of-service"
              className="hover:text-cyan-500 transition-colors"
            >
              Conditions d'utilisation
            </Link>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Victaure. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        show={showPrivacy} 
        onClose={() => setShowPrivacy(false)}
        title="Politique de confidentialité"
      >
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
      </AuthModal>

      <AuthModal
        show={showTerms}
        onClose={() => setShowTerms(false)}
        title="Conditions d'utilisation"
      >
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
      </AuthModal>
    </div>
  );
}
