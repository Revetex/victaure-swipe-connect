import { Bot } from "lucide-react";
import { motion } from "framer-motion";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 p-4 text-muted-foreground"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary/20"
      >
        <Bot className="h-4 w-4" />
      </motion.div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">M. Victaure réfléchit</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="text-lg leading-none"
            >
              .
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}