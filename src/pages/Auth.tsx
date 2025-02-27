
import { Suspense } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/sections/AuthHeader";
import { AuthFooter } from "@/components/auth/sections/AuthFooter";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { CountdownSection } from "@/components/auth/sections/CountdownSection";
import { InnovationsSection } from "@/components/auth/sections/InnovationsSection";
import { FeaturesSection } from "@/components/auth/sections/FeaturesSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandshakeIcon, Building2, Users } from "lucide-react";
import { PartnershipContactDialog } from "@/components/auth/sections/PartnershipContactDialog";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isPartnershipContactOpen, setIsPartnershipContactOpen] = useState(false);
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
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C] via-[#0B1026] to-[#1A1F2C] opacity-90" />
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at center, #64B5D9 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.05
          }} 
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-radial from-[#64B5D9]/10 via-transparent to-transparent" 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
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
          className="w-full max-w-lg lg:max-w-2xl mx-auto space-y-6"
        >
          <AuthHeader />
          <AuthForm redirectTo={location.state?.redirectTo} />
        </motion.div>

        <div className="mt-12 w-full max-w-7xl mx-auto px-4 space-y-16">
          <InnovationsSection />
          
          {/* Section Partenariat simplifiée */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4A]/80 to-[#1A1F2C]/80 border border-[#64B5D9]/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#64B5D9]/5 to-transparent" />
              <div className="relative p-6 sm:p-8 space-y-8">
                <div className="flex items-center gap-3 mb-8">
                  <HandshakeIcon className="h-6 w-6 text-[#64B5D9]" />
                  <h2 className="text-2xl font-semibold text-[#F1F0FB]">Programme Partenaire</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <Building2 className="h-6 w-6 text-[#64B5D9]" />
                    <h3 className="text-lg font-medium text-[#F1F0FB]">Entreprises</h3>
                    <p className="text-[#F1F0FB]/70 text-sm">Accédez à notre réseau de talents qualifiés et à nos outils innovants.</p>
                  </div>

                  <div className="space-y-3">
                    <Users className="h-6 w-6 text-[#64B5D9]" />
                    <h3 className="text-lg font-medium text-[#F1F0FB]">Recruteurs</h3>
                    <p className="text-[#F1F0FB]/70 text-sm">Optimisez vos processus avec notre IA et notre base de talents.</p>
                  </div>

                  <div className="space-y-3">
                    <HandshakeIcon className="h-6 w-6 text-[#64B5D9]" />
                    <h3 className="text-lg font-medium text-[#F1F0FB]">Startups</h3>
                    <p className="text-[#F1F0FB]/70 text-sm">Profitez de conditions adaptées à votre croissance.</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                  <Button 
                    onClick={() => setIsPartnershipContactOpen(true)}
                    className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Devenir Partenaire
                  </Button>
                </div>
              </div>
            </Card>
          </motion.section>

          <CountdownSection countdown={countdown} />
          <FeaturesSection />
        </div>
      </main>

      <Dialog open={isPartnershipContactOpen} onOpenChange={setIsPartnershipContactOpen}>
        <PartnershipContactDialog onClose={() => setIsPartnershipContactOpen(false)} />
      </Dialog>

      <AuthFooter />
    </div>
  );
}
