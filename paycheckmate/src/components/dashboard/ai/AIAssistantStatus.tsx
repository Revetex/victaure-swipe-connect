import { Bot } from "lucide-react";
import { motion } from "framer-motion";

interface AIAssistantStatusProps {
  isThinking?: boolean;
  isTyping?: boolean;
  isListening?: boolean;
}

export function AIAssistantStatus({ isThinking, isTyping, isListening }: AIAssistantStatusProps) {
  if (!isThinking && !isTyping && !isListening) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Bot className="h-4 w-4" />
      </motion.div>
      
      {isThinking && <span>M. Victaure réfléchit...</span>}
      {isTyping && <span>M. Victaure écrit...</span>}
      {isListening && <span>M. Victaure écoute...</span>}
      
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