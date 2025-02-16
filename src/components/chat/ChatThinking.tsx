
import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";

export function ChatThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-start gap-3 px-4 py-3"
    >
      <Avatar className="h-8 w-8">
        <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      </Avatar>
      
      <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
        <div className="flex gap-1.5 items-center">
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
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
