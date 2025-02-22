
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { motion } from "framer-motion";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { Briefcase, CalendarDays, Clock, Sparkles, ShoppingBag, Wallet, Tool, ActivitySquare, FileText, Users, Gavel, MessagesSquare } from "lucide-react";

export default function Auth() {
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard';
    sessionStorage.removeItem('redirectTo');
    return <Navigate to={redirectTo} replace />;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="w-8 h-8 text-primary" />
      </div>;
  }

  const features = [{
    icon: <Briefcase className="w-5 h-5" />,
    title: "Marketplace Complet",
    description: "Achetez, vendez et proposez vos services en toute simplicité"
  }, {
    icon: <Gavel className="w-5 h-5" />,
    title: "Enchères & Contrats",
    description: "Participez aux enchères et gérez vos contrats professionnels"
  }, {
    icon: <Users className="w-5 h-5" />,
    title: "Réseau Social Pro",
    description: "Connectez-vous avec la communauté du marché de l'emploi"
  }, {
    icon: <MessagesSquare className="w-5 h-5" />,
    title: "Assistant IA Personnel",
    description: "Conseils CV, orientation et aide à la recherche d'emploi"
  }, {
    icon: <FileText className="w-5 h-5" />,
    title: "Création de CV",
    description: "Créez un CV professionnel avec l'aide de l'IA"
  }, {
    icon: <ShoppingBag className="w-5 h-5" />,
    title: "Petits Jobs Flexibles",
    description: "Trouvez des missions ponctuelles sans engagement"
  }, {
    icon: <Wallet className="w-5 h-5" />,
    title: "Paiements Sécurisés",
    description: "Portefeuille digital et transactions protégées"
  }, {
    icon: <Tool className="w-5 h-5" />,
    title: "Boîte à Outils Pro",
    description: "Calculatrice, traducteur, notes et plus encore"
  }];

  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#9b87f5]/5 via-[#D6BCFA]/5 to-[#403E43]/5">
      <div className="fixed inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <motion.div className="fixed inset-0 opacity-20" style={{
      background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)"
    }} animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }} />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full p-4 sm:p-6 lg:p-8 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.4
        }} />
        
        <div className="w-full max-w-2xl mx-auto space-y-8 glass-panel rounded-2xl p-6 sm:p-8 border border-primary/10 backdrop-blur-sm relative">
          <motion.div className="flex flex-col items-center justify-center space-y-6" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }}>
            <div className="flex justify-center w-full">
              <Logo size="xl" className="transform-none" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-tiempos text-center">
              La Plateforme Complète du Marché de l'Emploi
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed text-center font-normal">
              Découvrez un écosystème complet pour votre carrière : emplois, services, réseau social et outils professionnels
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mt-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  initial={{
                    opacity: 0,
                    y: 20
                  }} 
                  animate={{
                    opacity: 1,
                    y: 0
                  }} 
                  transition={{
                    delay: index * 0.1
                  }} 
                  className="flex flex-col items-center p-4 rounded-lg bg-white/5 border border-primary/5 backdrop-blur-sm hover:bg-white/10 hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-2.5 rounded-full bg-primary/10 text-primary mb-3 ring-1 ring-primary/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <AuthVideo />

          <Suspense fallback={<div className="flex items-center justify-center">
              <Loader className="w-6 h-6 text-primary" />
            </div>}>
            <AuthForm redirectTo={location.state?.from?.pathname} />
          </Suspense>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Rejoignez la révolution de l'emploi flexible. <br />
              <span className="font-medium text-primary">Victaure</span> - Votre passerelle vers l'emploi du futur.
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/40 font-tiempos">© Thomas Blanchet</div>
      </main>
    </div>;
}
