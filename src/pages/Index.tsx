import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import { SimpleChat } from "@/components/SimpleChat";

// Optimized components with memo
const MemoizedHero = memo(Hero);
const MemoizedFeatures = memo(Features);
const MemoizedStats = memo(Stats);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.5,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const ActionButton = memo(function ActionButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="lg"
      onClick={onClick}
      className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <Briefcase className="h-5 w-5" />
      Voir les offres d'emploi
      <ArrowRight className="h-5 w-5" />
    </Button>
  );
});

export default function Index() {
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="relative min-h-screen overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
      >
        <motion.div variants={itemVariants}>
          <MemoizedHero />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SimpleChat />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MemoizedFeatures />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <MemoizedStats />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50"
          style={{ willChange: 'transform, opacity' }}
        >
          <ActionButton onClick={() => navigate("/marketplace")} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
