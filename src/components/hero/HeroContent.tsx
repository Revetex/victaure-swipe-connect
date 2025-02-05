import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroTrustIndicators } from "./HeroTrustIndicators";

export function HeroContent() {
  return (
    <div className="container px-4 mx-auto relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-8 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          <Logo size="xl" className="mx-auto" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.3,
            duration: 1,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#D6BCFA] bg-clip-text text-transparent font-playfair"
        >
          L'IA qui Propulse Votre Carrière
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-montserrat leading-relaxed"
        >
          Découvrez une nouvelle ère de recherche d'emploi avec notre assistant IA de pointe. 
          Analyses personnalisées, correspondances précises et conseils stratégiques pour 
          faire décoller votre carrière.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/auth">
            <Button 
              size="lg" 
              className="font-montserrat group relative overflow-hidden bg-[#9b87f5] hover:bg-[#8B5CF6] px-8 py-6 text-lg shadow-[0_0_20px_rgba(155,135,245,0.3)] hover:shadow-[0_0_30px_rgba(155,135,245,0.5)] transition-all duration-500"
            >
              <motion.span 
                className="relative z-10 flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Commencer maintenant
                <Sparkles className="ml-2 h-5 w-5" />
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#7E69AB]"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </Button>
          </Link>

          <Link to="/auth">
            <Button 
              variant="outline"
              size="lg" 
              className="font-montserrat group relative overflow-hidden border-[#9b87f5] text-primary hover:text-primary/90 px-8 py-6 text-lg backdrop-blur-sm bg-white/5"
            >
              <motion.span
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Explorer les opportunités
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Button>
          </Link>
        </motion.div>

        <HeroTrustIndicators />
      </motion.div>
    </div>
  );
}