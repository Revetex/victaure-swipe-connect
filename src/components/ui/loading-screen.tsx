import { motion } from "framer-motion";
import { Loader } from "./loader";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          },
        }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <Loader className="w-12 h-12 text-primary" />
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Loader className="w-12 h-12 text-primary/30" />
          </motion.div>
        </div>
        <p className="text-base text-muted-foreground animate-pulse">
          Chargement en cours...
        </p>
      </motion.div>
    </div>
  );
}