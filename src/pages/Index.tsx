import { HeroSection } from "@/components/hero/HeroSection";
import { Features } from "@/components/Features";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingFallback = () => (
  <div className="space-y-8 p-4">
    <Skeleton className="h-[400px] w-full rounded-xl" />
    <Skeleton className="h-[300px] w-full rounded-xl" />
    <Skeleton className="h-[200px] w-full rounded-xl" />
  </div>
);

export default function Index() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background via-purple-900/10 to-background font-montserrat overflow-hidden"
    >
      <div className="relative w-full">
        <Suspense fallback={<LoadingFallback />}>
          <HeroSection />
          <Features />
          <Footer />
        </Suspense>
      </div>
    </motion.div>
  );
}