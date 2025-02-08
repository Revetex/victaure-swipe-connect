
import { motion } from "framer-motion";
import { HeroBackground } from "./hero/HeroBackground";
import { HeroContent } from "./hero/HeroContent";
import { HeroDecorations } from "./hero/HeroDecorations";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Skeleton className="w-full max-w-2xl h-[400px] rounded-lg" />
  </div>
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background/80 to-background">
      <Suspense fallback={<LoadingFallback />}>
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeroBackground />
        </motion.div>
        
        <motion.div 
          className="relative z-10 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <HeroContent />
        </motion.div>

        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <HeroDecorations />
        </motion.div>
      </Suspense>
    </section>
  );
}
