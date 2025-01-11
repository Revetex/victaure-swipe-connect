import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ChatThinking() {
  return (
    <div className="flex items-start gap-3 px-4 py-2.5">
      <Avatar className="h-8 w-8 ring-2 ring-primary/10">
        <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="M. Victaure" />
        <AvatarFallback className="bg-primary/20">
          <Bot className="h-4 w-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex gap-1 items-center bg-card border rounded-2xl px-4 py-2.5 text-sm shadow-sm">
        <motion.span
          className="w-1.5 h-1.5 bg-foreground/50 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.span
          className="w-1.5 h-1.5 bg-foreground/50 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="w-1.5 h-1.5 bg-foreground/50 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  );
}