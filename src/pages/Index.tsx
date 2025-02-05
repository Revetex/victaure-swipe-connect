import { HeroSection } from "@/components/Hero";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Index() {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-background via-purple-900/10 to-background font-montserrat overflow-hidden"
    >
      <div className="relative w-full">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        
        <Suspense fallback={<LoadingFallback />}>
          <HeroSection />
          <Features />
          <Footer />
        </Suspense>
      </div>
    </motion.div>
  );
}