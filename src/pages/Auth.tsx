
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
import { Bot, Briefcase, Sparkles, Tool, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

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
      icon: Tool,
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
      {/* Logo and signature pattern */}
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

      <section className="w-full bg-white/5 backdrop-blur-sm py-16 border-t-2 border-[#D3E4FD]/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Choisissez votre plan
          </h2>
          <PricingGrid />
        </div>
      </section>

      <AuthFooter />
    </div>
  );
}
