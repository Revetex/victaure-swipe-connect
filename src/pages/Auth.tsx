
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
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Fond animé futuriste */}
      <div className="fixed inset-0 bg-[#1A1F2C] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#221F26] via-[#1A1F2C] to-[#221F26] opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#64B5D9]/20 via-transparent to-[#64B5D9]/20"
          animate={{
            x: ["-100%", "100%"],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-4 py-4 sm:py-6 lg:py-8 relative z-10">
        <div className="w-full max-w-lg lg:max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <AuthHeader />
          
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
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
                  onMaxQuestionsReached={() => {
                    toast.error("Veuillez vous connecter pour continuer la conversation avec Mr. Victaure");
                  }}
                  context="Tu es un assistant concis et amical qui aide les utilisateurs à s'inscrire. Donne des réponses courtes et naturelles, comme si tu parlais à un ami."
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

            <InnovationsSection />
            <CountdownSection countdown={countdown} />
            <FeaturesSection />
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <AuthFooter />
      </div>
    </div>
  );
}
