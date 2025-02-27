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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandshakeIcon, Building2, Users, Rocket } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import { PartnershipContactDialog } from "@/components/auth/sections/PartnershipContactDialog";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isPartnershipContactOpen, setIsPartnershipContactOpen] = useState(false);

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
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.3
          }} 
        />
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
          className="w-full max-w-lg lg:max-w-2xl mx-auto space-y-6"
        >
          <AuthHeader />
          <AuthForm redirectTo={location.state?.redirectTo} />
        </motion.div>

        <div className="mt-12 w-full max-w-7xl mx-auto px-4 space-y-16">
          <InnovationsSection />
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-[#1B2A4A]/80 to-[#1A1F2C]/80 border border-[#64B5D9]/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#64B5D9]/5 to-transparent" />
              <div className="relative p-6 space-y-8">
                <div className="flex items-center gap-3">
                  <HandshakeIcon className="h-6 w-6 text-[#64B5D9]" />
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-[#F1F0FB]">Programme de Partenariat</h2>
                    <p className="text-[#F1F0FB]/70 text-sm">
                      Rejoignez notre écosystème d'innovation et propulsez votre entreprise vers l'avenir
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <Building2 className="h-8 w-8 text-[#64B5D9]" />
                    <h3 className="text-lg font-medium text-[#F1F0FB]">Entreprises</h3>
                    <p className="text-[#F1F0FB]/70">Accédez à notre réseau exclusif de professionnels qualifiés. Bénéficiez d'outils innovants pour le recrutement et la gestion des talents.</p>
                    <ul className="text-[#F1F0FB]/60 text-sm space-y-2">
                      <li>• Accès prioritaire aux profils premium</li>
                      <li>• Outils de matching avancés</li>
                      <li>• Support dédié 24/7</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <Users className="h-8 w-8 text-[#64B5D9]" />
                    <h3 className="text-lg font-medium text-[#F1F0FB]">Recruteurs</h3>
                    <p className="text-[#F1F0FB]/70">Optimisez vos processus avec notre IA et accédez à une base de talents diversifiée et qualifiée.</p>
                    <ul className="text-[#F1F0FB]/60 text-sm space-y-2">
                      <li>• Analyse prédictive des candidats</li>
                      <li>• Automatisation des processus</li>
                      <li>• Rapports détaillés</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <Rocket className="h-8 w-8 text-[#64B5D9]" />
                    <h3 className="text-lg font-medium text-[#F1F0FB]">Startups</h3>
                    <p className="text-[#F1F0FB]/70">Programme spécial pour les startups en croissance avec des conditions préférentielles.</p>
                    <ul className="text-[#F1F0FB]/60 text-sm space-y-2">
                      <li>• Tarifs adaptés à votre croissance</li>
                      <li>• Formation et accompagnement</li>
                      <li>• Visibilité accrue</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex flex-col items-center gap-4">
                  <Button 
                    onClick={() => setIsPartnershipContactOpen(true)}
                    className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Devenir Partenaire
                  </Button>
                  <p className="text-[#F1F0FB]/50 text-sm">
                    Réponse garantie sous 24h ouvrées
                  </p>
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
