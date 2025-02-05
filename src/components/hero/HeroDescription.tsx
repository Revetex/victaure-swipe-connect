import { motion } from "framer-motion";

export function HeroDescription() {
  return (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-montserrat leading-relaxed tracking-wide"
    >
      Découvrez une plateforme révolutionnaire où l'IA optimise chaque aspect de votre activité : 
      réseaux sociaux, services professionnels et orientation stratégique.
    </motion.p>
  );
}