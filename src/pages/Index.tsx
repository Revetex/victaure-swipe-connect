import { HeroSection } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="min-h-screen relative overflow-hidden font-montserrat">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-purple-900/10 to-background" />
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, #9b87f5 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, #1EA5E9 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, #9b87f5 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, #1EA5E9 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, #9b87f5 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <HeroSection />
        <Features />
        <Footer />
      </motion.div>
    </div>
  );
}