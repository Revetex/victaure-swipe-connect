import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ThemeSelector } from "@/components/auth/ThemeSelector";
import { Logo } from "@/components/Logo";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { DownloadApp } from "@/components/dashboard/DownloadApp";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function Auth() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-light-purple via-background to-light-blue relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(45deg, var(--primary) 0%, transparent 100%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(-45deg, var(--secondary) 0%, transparent 100%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-playfair">
              Votre Assistant IA
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto font-montserrat">
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
            <Suspense fallback={<div>Chargement...</div>}>
              <AuthForm />
            </Suspense>
          </motion.div>

          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <DownloadApp />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}