import { UserRound, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
  showTimestamp?: boolean;
  timestamp?: Date;
}

export function ChatMessage({ 
  content, 
  sender, 
  thinking,
  showTimestamp,
  timestamp 
}: ChatMessageProps) {
  return (
    <div className="space-y-2">
      {showTimestamp && timestamp && (
        <div className="text-center">
          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
            {format(new Date(timestamp), "d MMMM à HH:mm", { locale: fr })}
          </span>
        </div>
      )}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex transition-all duration-300",
          sender === "user" ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] p-4 rounded-2xl flex items-center gap-3",
            sender === "user"
              ? "bg-primary text-primary-foreground rounded-br-sm shadow-lg"
              : "bg-card text-card-foreground border border-border rounded-bl-sm shadow-md",
            thinking ? "animate-pulse" : ""
          )}
        >
          {sender === "assistant" && !thinking && (
            <Bot className="h-5 w-5 shrink-0 text-primary" />
          )}
          <span className={cn(
            "text-base leading-relaxed",
            thinking ? "animate-pulse" : ""
          )}>{content}</span>
          {sender === "user" && (
            <UserRound className="h-5 w-5 shrink-0" />
          )}
        </div>
      </motion.div>
    </div>
  );
}