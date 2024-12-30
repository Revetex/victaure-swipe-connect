import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  content: string;
  sender: string;
  thinking?: boolean;
  showTimestamp?: boolean;
  timestamp?: string;
}

export function ChatMessage({
  content,
  sender,
  thinking = false,
  showTimestamp = false,
  timestamp,
}: ChatMessageProps) {
  const isBot = sender === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-3 items-start mb-4 last:mb-0",
        isBot ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm",
        isBot ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isBot ? (
          <Bot className="h-4 w-4" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>
      <div className={cn(
        "flex flex-col gap-1",
        isBot ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2 max-w-[80%] shadow-sm",
          isBot 
            ? "bg-muted text-muted-foreground" 
            : "bg-primary text-primary-foreground",
          thinking && "animate-pulse"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
        {showTimestamp && timestamp && (
          <span className="text-xs text-muted-foreground">
            {format(new Date(timestamp), "d MMMM 'à' HH:mm", { locale: fr })}
          </span>
        )}
      </div>
    </motion.div>
  );
}