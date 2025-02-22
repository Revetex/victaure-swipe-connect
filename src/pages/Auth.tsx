
import { Suspense } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/sections/AuthHeader";
import { AuthFooter } from "@/components/auth/sections/AuthFooter";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { VictaureChat } from "@/components/chat/VictaureChat";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CountdownSection } from "@/components/auth/sections/CountdownSection";
import { InnovationsSection } from "@/components/auth/sections/InnovationsSection";
import { FeaturesSection } from "@/components/auth/sections/FeaturesSection";
import { PricingDialog } from "@/components/auth/sections/PricingDialog";
import { toast } from "sonner";
import { ArrowRight, Coins } from "lucide-react";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const launchDate = new Date('2025-03-30T08:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
    sessionStorage.removeItem('redirectTo');
    return <Navigate to={redirectTo} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C]">
        <Loader className="w-8 h-8 text-[#64B5D9]" />
      </div>
    );
  }

  const handleMaxQuestionsReached = () => {
    toast.error("Veuillez vous connecter pour continuer la conversation avec Mr. Victaure");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1F2C] relative overflow-x-hidden">
      <div className="absolute inset-0 bg-pattern animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-4 py-4 sm:py-6 lg:py-8 relative z-10">
        <div className="w-full max-w-lg lg:max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <AuthHeader />

          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 sm:gap-4"
            >
              {/* Prix et Partenaire - Maintenant côte à côte sur desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] px-5 py-2.5 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-white/20 transition-transform duration-300 group-hover:translate-x-full" />
                  <Coins className="w-4 h-4 text-white" />
                  <span className="relative text-white font-medium">Voir les tarifs</span>
                </button>

                <button
                  onClick={() => window.open('https://victaure.com/partenaire', '_blank')}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] px-5 py-2.5 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 bg-white/20 transition-transform duration-300 group-hover:translate-x-full" />
                  <span className="relative text-white font-medium flex items-center gap-2">
                    Devenir partenaire
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </motion.div>

            <InnovationsSection />
            <CountdownSection countdown={countdown} />
            <FeaturesSection />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-sm sm:max-w-md mx-auto"
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#221F26]/50 to-[#1A1F2C]/50 blur-xl" />
            <div className="relative bg-[#2A2D3E]/80 backdrop-blur-md border border-[#64B5D9]/20 rounded-lg p-3 sm:p-4 shadow-lg overflow-hidden hover:border-[#64B5D9]/30 transition-all duration-300">
              <VictaureChat 
                maxQuestions={3}
                onMaxQuestionsReached={handleMaxQuestionsReached}
                context="Tu es un assistant de recrutement professionnel qui aide les utilisateurs à s'inscrire sur la plateforme Victaure. Encourage-les à créer un compte après 3 messages."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="border-2 border-[#64B5D9]/20 rounded-xl p-4 sm:p-6 bg-[#2A2D3E]/80 backdrop-blur-md w-full max-w-sm sm:max-w-md mx-auto"
          >
            <AuthForm />
          </motion.div>

          <PricingDialog 
            isPricingOpen={isPricingOpen}
            setIsPricingOpen={setIsPricingOpen}
          />
        </div>
      </main>

      <div className="relative z-10">
        <AuthFooter />
      </div>
    </div>
  );
}
