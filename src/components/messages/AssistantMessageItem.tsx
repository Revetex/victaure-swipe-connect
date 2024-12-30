import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface AssistantMessageItemProps {
  lastMessage: string;
  onClick: () => void;
}

export function AssistantMessageItem({ lastMessage, onClick }: AssistantMessageItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-muted hover:bg-muted/80"
    >
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/bot-avatar.png" alt="Mr. Victaure" />
          <AvatarFallback className="bg-victaure-blue/20">
            <Bot className="h-5 w-5 text-victaure-blue" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium truncate">Mr. Victaure</h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Assistant IA
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {lastMessage}
          </p>
        </div>
      </div>
    </motion.div>
  );
}