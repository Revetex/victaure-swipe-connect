
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
    const launchDate = new Date('2024-03-30T08:00:00').getTime();

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="w-8 h-8 text-[#64B5D9]" />
      </div>
    );
  }

  const handleMaxQuestionsReached = () => {
    toast.error("Veuillez vous connecter pour continuer la conversation avec Mr. Victaure");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-[#1B2A4A] to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/bcfe3f97-9c11-4615-821e-d9666f3a9c14.png')] bg-repeat opacity-[0.02] animate-[pulse_4s_ease-in-out_infinite]" />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="w-full max-w-xl mx-auto space-y-12">
          <AuthHeader />
          <InnovationsSection />
          <CountdownSection countdown={countdown} />
          <FeaturesSection />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#64B5D9]/10 to-black/30 blur-xl" />
            <div className="relative bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
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
            transition={{ delay: 0.2 }}
          >
            <AuthForm />
          </motion.div>

          <PricingDialog 
            isPricingOpen={isPricingOpen}
            setIsPricingOpen={setIsPricingOpen}
          />
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
