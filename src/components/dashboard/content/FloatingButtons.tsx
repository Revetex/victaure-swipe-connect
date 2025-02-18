
import { motion } from "framer-motion";
import { Sparkles, Radio, Zap } from "lucide-react";

export function FloatingButtons() {
  return (
    <motion.div
      variants={{ 
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      initial="initial"
      animate="animate"
      className="fixed bottom-8 right-8 flex gap-4"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <Radio className="w-6 h-6" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <Zap className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
}
