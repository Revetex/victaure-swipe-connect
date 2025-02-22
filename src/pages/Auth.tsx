import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { motion } from "framer-motion";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { MessagesSquare, Bot } from "lucide-react";

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
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

  const messages = [
    {
      text: "Bonjour ! Je suis Mr. Victaure, votre assistant personnel. Je vais vous présenter notre plateforme innovante.",
      delay: 0
    },
    {
      text: "Sur Victaure, vous pouvez créer votre CV professionnel avec mon aide. Je vous guide dans la rédaction et optimise votre profil. 📝",
      delay: 3
    },
    {
      text: "Notre système d'enchères et de contrats sécurisés vous permet de participer à des appels d'offres professionnels. 📊",
      delay: 6
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F5DEB3]/5 via-background to-[#8B7355]/5 relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-white/5 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <motion.div className="fixed inset-0 opacity-10" 
        style={{
          background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)"
        }} 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }} 
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <ThemeSelector />
      
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 py-8 sm:p-6 lg:p-8 relative z-10">
        <motion.div 
          className="w-full max-w-xl mx-auto space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            <Logo size="xl" className="transform-none" />
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-r from-[#8B7355] via-[#A0522D] to-[#D2B48C] bg-clip-text text-transparent font-tiempos text-center">
              La Plateforme Complète du Marché de l'Emploi
            </h1>

            <div className="w-full glass-panel rounded-xl p-4 border border-[#D2B48C]/10 space-y-4">
              <div className="flex items-center gap-2 text-[#8B7355]">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">Mr. Victaure</span>
              </div>

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  transition={{ 
                    delay: message.delay,
                    duration: 0.5,
                    height: {
                      duration: 0.4,
                    },
                  }}
                  className="ml-7 p-3 bg-[#F5DEB3]/5 dark:bg-[#8B7355]/5 rounded-lg border border-[#D2B48C]/10"
                >
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: message.delay + 0.2, duration: 0.3 }}
                    className="text-sm text-foreground/90"
                  >
                    {message.text}
                  </motion.p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-7 w-3 h-5 bg-[#8B7355]/50 rounded"
              />
            </div>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center">
              <Loader className="w-6 h-6 text-primary" />
            </div>
          }>
            <AuthForm redirectTo={location.state?.from?.pathname} />
          </Suspense>
        </motion.div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <span className="font-medium text-primary">Victaure</span> - Votre passerelle vers l'emploi du futur.
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/40 font-tiempos">
          © Thomas Blanchet
        </div>
      </main>
    </div>
  );
}
