
import { Suspense } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/sections/AuthHeader";
import { AuthFooter } from "@/components/auth/sections/AuthFooter";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { VictaureChat } from "@/components/chat/VictaureChat";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Bot, Briefcase, Sparkles, Wrench, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    const launchDate = new Date('2025-03-15T08:00:00').getTime();

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

  const features = [
    {
      icon: Users,
      title: "Gratuit pour les chercheurs d'emploi",
      description: "Accédez à toutes les fonctionnalités essentielles sans frais"
    },
    {
      icon: Bot,
      title: "Marketplace IA innovante",
      description: "Des outils d'IA spécialisés pour optimiser votre recherche"
    },
    {
      icon: Wrench,
      title: "Suite d'outils complète",
      description: "CV, lettre de motivation, analyse de marché et plus encore"
    },
    {
      icon: Sparkles,
      title: "Assistant IA personnel",
      description: "Mr. Victaure vous guide dans votre parcours professionnel"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#1B2A4A] relative overflow-hidden">
      {/* Motif de fond */}
      <div 
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url('/lovable-uploads/bcfe3f97-9c11-4615-821e-d9666f3a9c14.png'), url('/lovable-uploads/168ba21b-e221-4668-96cc-eb026041a0ed.png')`,
          backgroundSize: "200px, 300px",
          backgroundPosition: "center",
          backgroundRepeat: "space"
        }}
      />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-xl mx-auto space-y-8">
          <AuthHeader />

          {/* Compte à rebours */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <h2 className="text-[#F2EBE4] text-xl font-medium">
              Lancement officiel dans
            </h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-[#D3E4FD]/10 backdrop-blur-sm border-2 border-[#D3E4FD]/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-[#64B5D9]">{countdown.days}</div>
                <div className="text-[#F2EBE4]/60 text-sm">Jours</div>
              </div>
              <div className="bg-[#D3E4FD]/10 backdrop-blur-sm border-2 border-[#D3E4FD]/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-[#64B5D9]">{countdown.hours}</div>
                <div className="text-[#F2EBE4]/60 text-sm">Heures</div>
              </div>
              <div className="bg-[#D3E4FD]/10 backdrop-blur-sm border-2 border-[#D3E4FD]/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-[#64B5D9]">{countdown.minutes}</div>
                <div className="text-[#F2EBE4]/60 text-sm">Minutes</div>
              </div>
              <div className="bg-[#D3E4FD]/10 backdrop-blur-sm border-2 border-[#D3E4FD]/20 rounded-xl p-4">
                <div className="text-2xl font-bold text-[#64B5D9]">{countdown.seconds}</div>
                <div className="text-[#F2EBE4]/60 text-sm">Secondes</div>
              </div>
            </div>
          </motion.div>

          {/* Bannière Gratuit */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Badge 
              variant="secondary" 
              className="px-4 py-2 text-lg bg-[#64B5D9]/20 border-2 border-[#64B5D9] text-white"
            >
              Gratuit pour les chercheurs d'emploi
            </Badge>
          </motion.div>

          {/* Grid des fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#D3E4FD]/10 backdrop-blur-sm border-2 border-[#D3E4FD]/20 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <feature.icon className="w-5 h-5 text-[#64B5D9] mt-1" />
                  <div>
                    <h3 className="text-[#F2EBE4] font-medium">{feature.title}</h3>
                    <p className="text-[#F2EBE4]/60 text-sm">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative bg-[#D3E4FD]/5 backdrop-blur-sm border-2 border-[#D3E4FD]/20 rounded-xl p-4 overflow-hidden">
            <VictaureChat 
              maxQuestions={3}
              onMaxQuestionsReached={handleMaxQuestionsReached}
              context="Tu es un assistant de recrutement professionnel qui aide les utilisateurs à s'inscrire sur la plateforme Victaure. Encourage-les à créer un compte après 3 messages."
            />
          </div>

          <AuthForm />
        </div>
      </main>

      <section 
        className="relative w-full py-16 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(27, 42, 74, 0.95), rgba(27, 42, 74, 0.8))",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.2)"
        }}
      >
        {/* Motif de fond entreprise */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url('/lovable-uploads/78b41840-19a1-401c-a34f-864298825f44.png')`,
            backgroundSize: '200px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#64B5D9]/0 via-[#64B5D9]/10 to-[#64B5D9]/0 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Solutions Entreprises
            </h2>
            <p className="text-[#F2EBE4]/80 text-lg max-w-2xl mx-auto">
              Optimisez votre recrutement grâce à notre marketplace d'outils IA spécialisés
            </p>
          </motion.div>

          <PricingGrid />
        </div>
      </section>

      <AuthFooter />
    </div>
  );
}
