import { motion } from "framer-motion";
import { Shield, Star, Sparkles } from "lucide-react";

const indicators = [
  {
    icon: Shield,
    text: "Protection des données avancée"
  },
  {
    icon: Star,
    text: "+10,000 carrières transformées"
  },
  {
    icon: Sparkles,
    text: "IA de dernière génération"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function HeroTrustIndicators() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 sm:mt-12"
    >
      {indicators.map((indicator, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg"
        >
          <indicator.icon className="h-5 w-5 text-[#9b87f5]" />
          <span className="text-sm sm:text-base text-muted-foreground whitespace-nowrap">
            {indicator.text}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}