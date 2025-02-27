
import { Suspense } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/sections/AuthHeader";
import { AuthFooter } from "@/components/auth/sections/AuthFooter";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CountdownSection } from "@/components/auth/sections/CountdownSection";
import { InnovationsSection } from "@/components/auth/sections/InnovationsSection";
import { FeaturesSection } from "@/components/auth/sections/FeaturesSection";
import { PricingDialog } from "@/components/auth/sections/PricingDialog";
import { Dialog } from "@/components/ui/dialog";
import { PartnershipDialog } from "@/components/auth/sections/PartnershipDialog";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false);
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
        hours: Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
        minutes: Math.floor(distance % (1000 * 60 * 60) / (1000 * 60)),
        seconds: Math.floor(distance % (1000 * 60) / 1000)
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
    <div className="relative min-h-screen bg-[#0B1026] overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] via-[#0B1026] to-[#1A1F2C] opacity-90" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.3
        }} />
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
      </div>

      <ThemeSelector />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg lg:max-w-2xl mx-auto space-y-4 sm:space-y-6"
        >
          <div className="flex justify-end gap-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsPartnershipOpen(true)} 
              className="text-[#F1F0FB]/60 hover:text-[#F1F0FB] hover:bg-white/5"
            >
              Partenariat
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsPricingOpen(true)}
              className="text-[#F1F0FB]/60 hover:text-[#F1F0FB] hover:bg-white/5"
            >
              Guide tarifaire
            </Button>
          </div>

          <AuthHeader />
          <AuthForm redirectTo={location.state?.redirectTo} />
        </motion.div>

        <div className="mt-12 w-full max-w-7xl mx-auto px-4 space-y-16">
          <InnovationsSection />
          <CountdownSection countdown={countdown} />
          <FeaturesSection />
        </div>
      </main>

      <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
        <PricingDialog isPricingOpen={isPricingOpen} setIsPricingOpen={setIsPricingOpen} />
      </Dialog>

      <Dialog open={isPartnershipOpen} onOpenChange={setIsPartnershipOpen}>
        <PartnershipDialog />
      </Dialog>

      <AuthFooter />
    </div>
  );
}
