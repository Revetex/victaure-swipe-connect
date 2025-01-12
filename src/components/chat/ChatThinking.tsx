import { motion } from "framer-motion";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex gap-1.5 items-center bg-card border rounded-2xl px-4 py-2.5 text-sm shadow-sm"
      >
        <motion.div className="flex items-center gap-1">
          <motion.span
            className="w-2 h-2 bg-primary/50 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0
            }}
          />
          <motion.span
            className="w-2 h-2 bg-primary/50 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0.2
            }}
          />
          <motion.span
            className="w-2 h-2 bg-primary/50 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0.4
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}