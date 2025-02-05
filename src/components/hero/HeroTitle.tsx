import { motion } from "framer-motion";

export function HeroTitle() {
  return (
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight font-playfair mb-6"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-lime-400 via-lime-300 to-green-200 bg-clip-text text-transparent"
      >
        L'IA au Service de Votre Succès
      </motion.span>
      <br />
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-300 font-extralight"
      >
        Premier Écosystème Digital Intelligent
      </motion.span>
    </motion.h1>
  );
}