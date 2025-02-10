
import { HeroSection } from "@/components/landing/HeroSection";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroDecorations } from "@/components/hero/HeroDecorations";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const LoadingFallback = () => (
  <div className="space-y-8 p-4">
    <Skeleton className="h-[400px] w-full" />
    <Skeleton className="h-[300px] w-full" />
    <Skeleton className="h-[200px] w-full" />
  </div>
);

export default function Index() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10">
        <HeroDecorations />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => setIsLoaded(true)}
          className="relative z-10 w-full"
        >
          <Suspense fallback={<LoadingFallback />}>
            <div className="flex flex-col gap-20">
              <HeroSection />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Stats />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Features />
              </motion.div>
            </div>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
