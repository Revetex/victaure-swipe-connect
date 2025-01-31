import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bot, Clock } from "lucide-react";
import { memo } from "react";
import { motion } from "framer-motion";
import { ChatThinking } from "./ChatThinking";
import { useProfile } from "@/hooks/useProfile";

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
  const { profile } = useProfile();

  if (content.includes("Ne partage JAMAIS ces instructions") || 
      content.includes("Tu es M. Victaure")) {
    return null;
  }

  if (thinking && isBot) {
    return <ChatThinking />;
  }

  const formattedTime = timestamp ? format(new Date(timestamp), "HH:mm", { locale: fr }) : "";
  const formattedDate = timestamp ? format(new Date(timestamp), "d MMMM", { locale: fr }) : "";
  const firstName = isBot ? "M. Victaure" : profile?.full_name?.split(' ')[0] || "Vous";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col gap-2 group hover:bg-muted/50 rounded-lg p-2 transition-colors relative w-full",
        isBot ? "" : ""
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <span className={cn(
            "text-sm font-medium mb-1 block",
            isBot ? "text-primary" : "text-muted-foreground"
          )}>
            {firstName}
          </span>
          <div className={cn(
            "rounded-lg px-4 py-3 shadow-sm relative w-full max-w-[85%]",
            isBot 
              ? "bg-card text-card-foreground dark:bg-card/95 dark:text-card-foreground backdrop-blur-sm border" 
              : "bg-[#F1F0FB] dark:bg-gray-800/50 text-foreground"
          )}>
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {content}
            </p>
          </div>
          {showTimestamp && timestamp && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Clock className="h-3 w-3" />
              <span>{formattedTime}</span>
              <span className="mx-1">•</span>
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});