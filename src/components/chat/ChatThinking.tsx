import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 px-3 py-2 sm:px-4"
    >
      <Avatar className="h-8 w-8 ring-2 ring-primary/10 hover:ring-primary/20">
        <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" />
        <AvatarFallback className="bg-primary/5">
          <Bot className="h-4 w-4 text-primary" />
        </AvatarFallback>
      </Avatar>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <span>M. Victaure réfléchit</span>
        <motion.div className="flex items-center gap-1 pl-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary/50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}