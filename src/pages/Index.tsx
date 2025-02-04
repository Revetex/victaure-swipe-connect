import { HeroSection } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-900/10 to-background font-montserrat overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <Features />
        <Footer />
      </motion.div>
    </div>
  );
}