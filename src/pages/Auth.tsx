
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
        "bg-gradient-to-br from-[#131B25] via-[#1B2A4A] to-[#1A1F2C]",
        "text-white overflow-x-hidden"
      )}
      style={{ minHeight: viewportHeight ? `${viewportHeight}px` : "100vh" }}
    >
      {/* Background amélioré avec circuit et effets visuels */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <CircuitBackground />
        
        {/* Particules et halos lumineux */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ 
              opacity: 0.1, 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: [Math.random() * 0.5 + 0.5, Math.random() * 1 + 1, Math.random() * 0.5 + 0.5]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute w-2 h-2 rounded-full bg-[#64B5D9] blur-[2px]"
          />
        ))}
        
        {/* Gros halos colorés */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#64B5D9]/10 rounded-full blur-[100px]"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1] 
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#D3E4FD]/10 rounded-full blur-[100px]"
        />

        {/* Grille de fond subtile */}
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:50px_50px] opacity-30" />
        
        {/* Overlay gradient pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#131B25]/50 via-transparent to-[#1A1F2C]/50" />
      </div>

      <div className="w-full z-10">
        <AuthHeader />
        <main className="container px-4 pt-6 pb-12 md:pt-12 md:pb-24 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 xl:gap-16">
            {/* Zone du formulaire: occupe 2 colonnes sur 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="backdrop-blur-lg bg-[#1A1F2C]/40 border border-[#64B5D9]/10 rounded-2xl p-6 shadow-xl">
                <AuthForm />
              </div>
            </motion.div>

            {/* Zone de vidéo et contenu annexe: occupe 3 colonnes sur 5 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="lg:col-span-3"
            >
              <div className="backdrop-blur-lg bg-[#1A1F2C]/40 border border-[#64B5D9]/10 rounded-2xl overflow-hidden shadow-xl h-full">
                <AuthVideo />
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-[#64B5D9] to-[#D3E4FD] bg-clip-text text-transparent mb-3">
                    Propulsez votre carrière avec Victaure
                  </h3>
                  <p className="text-[#F2EBE4]/80 text-sm leading-relaxed">
                    Victaure combine l'intelligence artificielle avancée et une expertise du marché 
                    de l'emploi pour vous offrir une plateforme complète qui transforme votre 
                    recherche d'emploi. Découvrez des opportunités correspondant parfaitement à 
                    vos compétences et aspirations.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["IA", "Emploi", "CV", "Carrière", "Recrutement"].map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-[#64B5D9]/10 text-[#64B5D9] text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
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
