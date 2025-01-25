import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 text-muted-foreground"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Bot className="h-4 w-4" />
      </motion.div>
      <span>M. Victaure réfléchit</span>
      <motion.div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * 0.2
            }}
            className="text-lg leading-none"
          >
            •
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}