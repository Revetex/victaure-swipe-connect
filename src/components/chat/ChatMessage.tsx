import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bot, User } from "lucide-react";
import { memo } from "react";
import { motion } from "framer-motion";
import { ChatThinking } from "./ChatThinking";

interface ChatMessageProps {
  content: string;
  sender: string;
  thinking?: boolean;
  showTimestamp?: boolean;
  timestamp?: string;
}

export const ChatMessage = memo(function ChatMessage({
  content,
  sender,
  thinking = false,
  showTimestamp = false,
  timestamp,
}: ChatMessageProps) {
  const isBot = sender === "assistant";

  if (thinking && isBot) {
    return <ChatThinking />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-3 items-start group hover:bg-muted/50 rounded-lg p-4 transition-all duration-200",
        isBot ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm transition-transform duration-200 group-hover:scale-110",
          isBot ? "bg-primary text-primary-foreground ring-2 ring-primary/10" : "bg-muted"
        )}
      >
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "flex flex-col gap-1 min-w-0 w-full max-w-[85%]",
          isBot ? "items-start" : "items-end"
        )}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={cn(
            "rounded-lg px-4 py-2.5 w-full shadow-sm backdrop-blur-sm transition-colors duration-200",
            isBot
              ? "bg-muted/80 text-foreground hover:bg-muted"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </p>
        </motion.div>
        {showTimestamp && timestamp && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {format(new Date(timestamp), "d MMMM 'à' HH:mm", { locale: fr })}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
});