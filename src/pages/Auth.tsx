import { AuthForm } from "@/components/auth/AuthForm";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Logo } from "@/components/Logo";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
    <div className="min-h-[100vh] min-h-[100dvh] w-full flex flex-col items-center px-4 py-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dashboard-pattern bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="w-full flex justify-center mb-12">
          <Logo size="lg" className="w-28 h-28" />
        </div>

        {/* Welcome Text */}
        <div className="w-full text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Bienvenue sur Victaure
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Connectez-vous ou créez un compte pour continuer
          </p>
        </div>

        {/* Auth Form */}
        <div className="w-full mb-12">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-slate-200/20 dark:border-slate-700/20">
            <AuthForm />
          </div>
        </div>

        {/* Video Section */}
        <div className="w-full max-w-2xl mb-12">
          <AuthVideo />
        </div>

        {/* Footer */}
        <div className="w-full text-center space-y-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 space-x-3">
            <Link 
              to="/politique-confidentialite"
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <span>•</span>
            <Link
              to="/conditions-utilisation"
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Conditions d'utilisation
            </Link>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 Victaure. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
}