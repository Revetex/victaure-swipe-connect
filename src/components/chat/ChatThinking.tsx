import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-2 p-3 text-muted-foreground/60"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <Bot className="h-3.5 w-3.5" />
      </motion.div>
      <motion.span 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.2 }}
        className="text-sm font-light"
      >
        M. Victaure réfléchit
      </motion.span>
    </motion.div>
  );
}