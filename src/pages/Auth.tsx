
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
        "bg-gradient-to-b from-[#131B25] via-[#1B2A4A] to-[#1A1F2C]",
        "text-white overflow-x-hidden"
      )}
      style={{ minHeight: viewportHeight ? `${viewportHeight}px` : "100vh" }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Éléments décoratifs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#64B5D9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#64B5D9]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-[#D3E4FD]/10 rounded-full blur-2xl"></div>
      </motion.div>

      <div className="w-full z-10">
        <AuthHeader />
        <main className="container px-4 pt-6 pb-12 md:pt-12 md:pb-24 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <AuthForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="hidden lg:block"
            >
              <AuthVideo />
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
