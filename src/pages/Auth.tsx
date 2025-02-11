
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";

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
        <Loader className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#9b87f5]/5 via-[#D6BCFA]/5 to-[#403E43]/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* AI-themed animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-px bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
      
      <ThemeSelector />
      
      <main className="flex-1 w-full py-12 px-4 relative z-10">
        <div className="container max-w-xl mx-auto space-y-12">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="xl" className="mx-auto" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-playfair">
              Votre Assistant IA
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto font-montserrat">
              Découvrez la puissance de l'intelligence artificielle pour votre recherche d'emploi
            </p>
          </motion.div>

          <AuthVideo />

          <motion.div 
            className="glass-card p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <Loader className="w-6 h-6 text-primary" />
              </div>
            }>
              <AuthForm redirectTo={location.state?.from?.pathname} />
            </Suspense>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
