
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
  const [isChatVisible, setIsChatVisible] = useState(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader className="w-8 h-8 text-[#64B5D9]" />
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
    sessionStorage.removeItem('redirectTo');
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B1026] overflow-hidden">
      {/* Fond galaxie futuriste */}
      <div className="fixed inset-0">
        {/* Gradient de base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] via-[#0B1026] to-[#1A1F2C] opacity-90" />
        
        {/* Étoiles scintillantes */}
        <div className="absolute inset-0" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', 
            backgroundSize: '50px 50px', 
            opacity: 0.3 
          }} 
        />
        
        {/* Nébuleuse */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#64B5D9]/5 via-[#9B6CD9]/5 to-[#64B5D9]/5"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Étoiles filantes */}
        {[...Array(3)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute h-[1px] w-[100px] bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{
              x: ['-100%', '200%'],
              y: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 2,
              ease: "linear",
              delay: i * 2
            }}
            style={{
              top: `${20 + i * 25}%`,
              left: `${i * 30}%`
            }}
          />
        ))}

        {/* Constellations */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='40' y1='40' x2='160' y2='160' stroke='rgba(255,255,255,0.1)' stroke-width='0.5'/%3E%3Cline x1='40' y1='160' x2='160' y2='40' stroke='rgba(255,255,255,0.1)' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='1.5' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='160' cy='160' r='1.5' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='40' cy='160' r='1.5' fill='white' fill-opacity='0.4'/%3E%3Ccircle cx='160' cy='40' r='1.5' fill='white' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      <ThemeSelector />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg lg:max-w-2xl mx-auto space-y-4 sm:space-y-6"
        >
          <AuthHeader />
          
          <div className="space-y-4 sm:space-y-6">
            <Suspense fallback={
              <div className="flex justify-center">
                <Loader className="w-6 h-6 text-[#64B5D9]" />
              </div>
            }>
              {isChatVisible && (
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
                        setIsChatVisible(false);
                        toast.error("Veuillez vous connecter pour continuer la conversation avec Mr. Victaure");
                      }}
                      context="Tu es un assistant concis et amical qui aide les utilisateurs à s'inscrire. Donne des réponses courtes et naturelles, comme si tu parlais à un ami."
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mx-auto w-full max-w-sm sm:max-w-md"
              >
                <div className="bg-[#1B2A4A]/60 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border-2 border-[#64B5D9]/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative">
                  {/* Effet de brillance sur les bords */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#64B5D9]/20 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#64B5D9]/20 to-transparent" />
                  </div>

                  <AuthForm redirectTo={location.state?.redirectTo} />
                </div>
              </motion.div>
            </Suspense>

            <InnovationsSection />
            <CountdownSection countdown={countdown} />
            <FeaturesSection />
          </div>
        </motion.div>
      </main>

      <AuthFooter />
    </div>
  );
}
