import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroTrustIndicators } from "./HeroTrustIndicators";

const textVariants = {
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

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.175, 0.885, 0.32, 1.275]
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95
  }
};

export function HeroContent() {
  return (
    <div className="container px-4 mx-auto relative z-10">
      <motion.div 
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8 max-w-4xl mx-auto mt-16 sm:mt-20"
      >
        <motion.div variants={textVariants}>
          <Logo size="xl" className="mx-auto" />
        </motion.div>
        
        <motion.h1 
          variants={textVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#D6BCFA] bg-clip-text text-transparent font-playfair"
        >
          L'IA qui Révolutionne le Recrutement
        </motion.h1>
        
        <motion.p 
          variants={textVariants}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-montserrat leading-relaxed"
        >
          Victaure transforme le processus de recrutement grâce à l'intelligence artificielle. 
          Notre technologie de pointe analyse, correspond et connecte les meilleurs talents 
          aux opportunités parfaites, créant des connexions professionnelles qui durent.
        </motion.p>
        
        <motion.div 
          variants={textVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link to="/auth">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                size="lg" 
                className="w-full sm:w-auto font-montserrat group relative overflow-hidden bg-[#9b87f5] hover:bg-[#8B5CF6] px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-500"
              >
                <span className="relative z-10 flex items-center whitespace-nowrap">
                  Commencer maintenant
                  <Sparkles className="ml-2 h-5 w-5" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#7E69AB]"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </Button>
            </motion.div>
          </Link>

          <Link to="/auth">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                variant="outline"
                size="lg" 
                className="w-full sm:w-auto font-montserrat group relative overflow-hidden border-[#9b87f5] text-primary hover:text-primary/90 px-8 py-6 text-lg backdrop-blur-sm bg-white/5"
              >
                <span className="flex items-center whitespace-nowrap">
                  Explorer les opportunités
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        <HeroTrustIndicators />
      </motion.div>
    </div>
  );
}