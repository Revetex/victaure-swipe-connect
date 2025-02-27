
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/sections/AuthHeader";
import { AuthFooter } from "@/components/auth/sections/AuthFooter";
import { cn } from "@/lib/utils";
import { AuthVideo } from "@/components/auth/AuthVideo";
import { FeaturesSection } from "@/components/auth/sections/FeaturesSection";
import { InnovationsSection } from "@/components/auth/sections/InnovationsSection";
import { CountdownSection } from "@/components/auth/sections/CountdownSection";
import { motion } from "framer-motion";
import { CircuitBackground } from "@/components/vcard/contact/CircuitBackground";

export default function Auth() {
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  // Valeur par défaut pour le compte à rebours
  const defaultCountdown = {
    days: 30,
    hours: 12,
    minutes: 30,
    seconds: 0
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-between min-h-screen w-full",
        "bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1A1F2C]",
        "text-white overflow-x-hidden"
      )}
      style={{ minHeight: viewportHeight ? `${viewportHeight}px` : "100vh" }}
    >
      {/* Background amélioré avec animations et effets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <CircuitBackground />
        
        {/* Étoiles scintillantes */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            initial={{ opacity: 0.1 }}
            animate={{ 
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Halos lumineux animés */}
        <motion.div
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            rotate: 360
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#64B5D9]/10 rounded-full blur-[100px]"
        />
        
        <motion.div
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            rotate: -360
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-[#D3E4FD]/10 rounded-full blur-[120px]"
        />

        {/* Grille avec effet de profondeur */}
        <div 
          className="absolute inset-0 bg-grid-white/[0.02]" 
          style={{ 
            backgroundSize: '50px 50px',
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)'
          }}
        />

        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      </div>

      <div className="w-full z-10">
        <AuthHeader />
        <main className="container px-4 pt-6 pb-12 md:pt-12 md:pb-24 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16">
            {/* Zone du formulaire */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <AuthForm />
              </div>
            </motion.div>

            {/* Zone de vidéo et contenu */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="lg:col-span-3"
            >
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <AuthVideo />
                
                <div className="p-6">
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="text-xl font-semibold bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent mb-3"
                  >
                    Découvrez la puissance de Victaure
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="text-[#F2EBE4]/80 text-sm leading-relaxed"
                  >
                    Transformez votre recherche d'emploi avec notre plateforme alimentée par l'IA.
                    Accédez à des opportunités sur mesure, des outils de carrière avancés et
                    une communauté de professionnels partageant les mêmes valeurs.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="mt-4 flex flex-wrap gap-2"
                  >
                    {[
                      "Intelligence Artificielle",
                      "Matching Avancé",
                      "CV Dynamique",
                      "Analyse de Carrière",
                      "Réseau Pro"
                    ].map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-[#64B5D9]/10 text-[#64B5D9] text-xs rounded-full
                                 border border-[#64B5D9]/20 hover:bg-[#64B5D9]/20 transition-colors
                                 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Sections d'information */}
          <div className="my-16 space-y-16">
            <FeaturesSection />
            <InnovationsSection />
            <CountdownSection countdown={defaultCountdown} />
          </div>
        </main>
      </div>
      <AuthFooter />
    </div>
  );
}
