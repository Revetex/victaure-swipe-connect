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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5">
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
        
        {/* Enhanced AI-themed animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Small stars */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`star-sm-${i}`}
              className="absolute h-1 w-1 rounded-full bg-primary/40"
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

          {/* Medium stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`star-md-${i}`}
              className="absolute h-2 w-2 rounded-full bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Large stars with glow effect */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`star-lg-${i}`}
              className="absolute h-3 w-3 rounded-full bg-primary/20 shadow-lg shadow-primary/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1.8, 0],
                opacity: [0, 0.7, 0],
                boxShadow: [
                  "0 0 0 0 rgba(var(--primary), 0)",
                  "0 0 30px 4px rgba(var(--primary), 0.4)",
                  "0 0 0 0 rgba(var(--primary), 0)",
                ],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Connecting lines */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute h-px bg-primary/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
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
        <div className="container max-w-xl mx-auto space-y-8">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="xl" className="mx-auto" />
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-playfair">
                VICTAURE
              </h1>
              <p className="text-lg text-muted-foreground font-montserrat">
                Technologies.inc
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto font-montserrat">
              L'IA qui révolutionne votre recherche d'emploi
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