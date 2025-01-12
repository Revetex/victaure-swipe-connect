import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 px-4 py-2.5"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Avatar className="h-8 w-8 ring-2 ring-primary/10">
          <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
          <AvatarFallback className="bg-primary/20">
            <Bot className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex gap-1.5 items-center bg-card border rounded-2xl px-4 py-2.5 text-sm shadow-sm"
      >
        <span className="text-muted-foreground text-xs ml-1">M. Victaure réfléchit...</span>
        <motion.div className="flex items-center gap-1">
          <motion.span
            className="w-2 h-2 bg-primary/50 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.span
            className="w-2 h-2 bg-primary/50 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
          <motion.span
            className="w-2 h-2 bg-primary/50 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}