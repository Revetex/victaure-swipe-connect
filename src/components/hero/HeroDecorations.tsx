import { motion } from "framer-motion";

export function HeroDecorations() {
  return (
    <>
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 -left-4 w-96 h-96 bg-[#9b87f5]/20 rounded-full filter blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 -right-4 w-96 h-96 bg-[#D6BCFA]/20 rounded-full filter blur-3xl"
      />
    </>
  );
}