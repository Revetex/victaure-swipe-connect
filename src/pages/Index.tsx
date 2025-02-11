
import { HeroSection } from "@/components/landing/HeroSection";
import { Features } from "@/components/Features";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingFallback = () => (
  <div className="space-y-8 p-4">
    <Skeleton className="h-[400px] w-full" />
    <Skeleton className="h-[300px] w-full" />
    <Skeleton className="h-[200px] w-full" />
  </div>
);

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-purple-900/5 to-background">
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <HeroSection />
            <Features />
          </Suspense>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
