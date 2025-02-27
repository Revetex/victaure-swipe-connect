
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/sections/AuthHeader";
import { AuthFooter } from "@/components/auth/sections/AuthFooter";
import { cn } from "@/lib/utils";
import { FeaturesSection } from "@/components/auth/sections/FeaturesSection";
import { InnovationsSection } from "@/components/auth/sections/InnovationsSection";
import { CountdownSection } from "@/components/auth/sections/CountdownSection";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/auth/background/AnimatedBackground";
import { VideoContent } from "@/components/auth/sections/VideoContent";

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
      <AnimatedBackground />

      <div className="w-full z-10">
        <AuthHeader />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-12 lg:pb-24">
          {/* Section principale avec grille */}
          <div className="max-w-8xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 xl:gap-12">
              {/* Zone du formulaire */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="lg:col-span-2 flex flex-col"
              >
                <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl h-full">
                  <AuthForm />
                </div>
              </motion.div>

              {/* Zone de vidéo et contenu */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="lg:col-span-3 flex flex-col"
              >
                <VideoContent />
              </motion.div>
            </div>
          </div>
          
          {/* Sections d'information avec meilleur espacement */}
          <div className="max-w-8xl mx-auto mt-24 space-y-24">
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
