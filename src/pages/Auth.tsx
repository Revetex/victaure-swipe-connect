
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
    <div className="min-h-screen flex flex-col bg-[#1A1F2C] relative">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/bcfe3f97-9c11-4615-821e-d9666f3a9c14.png')] bg-repeat opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <AuthHeader />
          <InnovationsSection />
          <CountdownSection countdown={countdown} />
          <FeaturesSection />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#221F26]/50 to-[#1A1F2C]/50 blur-xl" />
            <div className="relative bg-[#221F26]/30 backdrop-blur-md border border-white/10 rounded-lg p-4 shadow-lg overflow-hidden hover:border-white/20 transition-all duration-300">
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
            className="border-2 border-[#64B5D9]/20 rounded-xl p-6 bg-[#221F26]/50 backdrop-blur-md"
          >
            <AuthForm />
          </motion.div>

          <PricingDialog 
            isPricingOpen={isPricingOpen}
            setIsPricingOpen={setIsPricingOpen}
          />
        </div>
      </main>

      <div className="relative z-10 pb-20">
        <AuthFooter />
      </div>
    </div>
  );
}
