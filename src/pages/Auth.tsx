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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Briefcase, 
  Sparkles, 
  Wrench, 
  Users, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Timer,
  ShoppingBag,
  Gavel,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

  const innovations = [
    {
      icon: ShieldCheck,
      title: "Résiliation sans engagement",
      description: "Liberté totale dans votre utilisation du service"
    },
    {
      icon: CreditCard,
      title: "Paiement sécurisé direct",
      description: "Transactions protégées et instantanées"
    },
    {
      icon: ShoppingBag,
      title: "Marketplace intégrée",
      description: "Achetez et vendez en toute simplicité"
    },
    {
      icon: Gavel,
      title: "Contrats aux enchères",
      description: "Système d'enchères innovant pour les contrats"
    }
  ];

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
      icon: Timer,
      title: "Gestion flexible",
      description: "Gérez vos services sans engagement"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1B2A4A] via-[#1B2A4A] to-[#152238] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/bcfe3f97-9c11-4615-821e-d9666f3a9c14.png')] bg-repeat opacity-[0.02] animate-[pulse_4s_ease-in-out_infinite]" />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="w-full max-w-xl mx-auto space-y-12">
          <AuthHeader />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#64B5D9]/20 to-[#64B5D9]/10 p-4 rounded-xl border border-[#64B5D9]/30 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#64B5D9]" />
              <h3 className="text-white font-semibold">Nouvelles Fonctionnalités</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {innovations.map((innovation, index) => (
                <motion.div
                  key={innovation.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <innovation.icon className="w-5 h-5 text-[#64B5D9] mt-1" />
                  <div>
                    <h4 className="text-white text-sm font-medium">{innovation.title}</h4>
                    <p className="text-[#F2EBE4]/60 text-xs">{innovation.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#64B5D9]/0 via-[#64B5D9]/5 to-[#64B5D9]/0 blur-xl" />
            <div className="relative space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">
                Lancement officiel dans
              </h2>
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {[
                  { value: countdown.days, label: "Jours" },
                  { value: countdown.hours, label: "Heures" },
                  { value: countdown.minutes, label: "Minutes" },
                  { value: countdown.seconds, label: "Secondes" }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-[#D3E4FD]/10 to-transparent backdrop-blur-lg border border-[#D3E4FD]/20 rounded-xl p-4 flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                  >
                    <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent">
                      {item.value}
                    </span>
                    <span className="text-[#F2EBE4]/60 text-sm mt-1">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Badge 
              variant="secondary" 
              className="px-6 py-3 text-lg bg-gradient-to-r from-[#64B5D9]/20 to-[#64B5D9]/10 backdrop-blur-sm border-2 border-[#64B5D9] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Gratuit pour les chercheurs d'emploi
            </Badge>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gradient-to-br from-[#D3E4FD]/10 to-transparent backdrop-blur-lg border border-[#D3E4FD]/20 rounded-xl p-6 hover:bg-[#D3E4FD]/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-[#64B5D9]/20 group-hover:bg-[#64B5D9]/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-[#64B5D9]" />
                  </div>
                  <div>
                    <h3 className="text-[#F2EBE4] font-semibold text-lg mb-2 group-hover:text-[#64B5D9] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[#F2EBE4]/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#64B5D9]/10 to-[#1B2A4A]/30 blur-xl" />
            <div className="relative bg-gradient-to-br from-[#D3E4FD]/10 to-transparent backdrop-blur-lg border border-[#D3E4FD]/20 rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
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

          <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
            <DialogContent className="max-w-4xl w-11/12 h-[80vh] overflow-y-auto bg-[#1B2A4A] border-2 border-[#64B5D9]/30">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-white mb-6">
                  Tarifs Victaure 2024
                </DialogTitle>
              </DialogHeader>
              <PricingGrid />
            </DialogContent>
          </Dialog>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={() => setIsPricingOpen(true)}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] px-6 py-3 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transition-transform duration-300 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-2 text-white font-medium">
                Voir tous nos tarifs
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </motion.div>
        </div>
      </main>

      <section 
        className="relative w-full py-20 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(27, 42, 74, 0.98), rgba(21, 34, 56, 0.95))",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.2)"
        }}
      >
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url('/lovable-uploads/78b41840-19a1-401c-a34f-864298825f44.png')`,
            backgroundSize: '200px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            animation: 'float 20s ease-in-out infinite'
          }}
        />

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#64B5D9]/0 via-[#64B5D9]/5 to-[#64B5D9]/0" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#64B5D9]/20 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white via-[#D3E4FD] to-[#64B5D9] bg-clip-text text-transparent">
                Solutions Entreprises
              </span>
            </h2>
            <p className="text-[#F2EBE4]/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Optimisez votre recrutement grâce à notre marketplace d'outils IA spécialisés.
              Une suite complète pour vos besoins RH.
            </p>
          </motion.div>

          <PricingGrid />
        </div>
      </section>

      <AuthFooter />
    </div>
  );
}
