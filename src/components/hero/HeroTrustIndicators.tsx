
import { motion } from "framer-motion";
import { Shield, Star, Sparkles } from "lucide-react";

export function HeroTrustIndicators() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="flex flex-wrap justify-center gap-8 mt-12"
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-white/5 p-3 rounded-lg backdrop-blur-sm"
      >
        <Shield className="h-5 w-5 text-[#9b87f5]" />
        <span className="text-muted-foreground">Protection des données avancée</span>
      </motion.div>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-white/5 p-3 rounded-lg backdrop-blur-sm"
      >
        <Star className="h-5 w-5 text-[#9b87f5]" />
        <span className="text-muted-foreground">+10,000 carrières transformées</span>
      </motion.div>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 bg-white/5 p-3 rounded-lg backdrop-blur-sm"
      >
        <Sparkles className="h-5 w-5 text-[#9b87f5]" />
        <span className="text-muted-foreground">IA de dernière génération</span>
      </motion.div>
    </motion.div>
  );
}
