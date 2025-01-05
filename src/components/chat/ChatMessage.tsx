import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Bot, User } from "lucide-react";
import { memo } from "react";
import { motion } from "framer-motion";
import { ChatThinking } from "./ChatThinking";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  if (thinking && isBot) {
    return <ChatThinking />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex gap-3 items-start group hover:bg-muted/50 rounded-lg p-4 transition-colors",
        isBot ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className="shrink-0">
        {isBot ? (
          <div className={cn(
            "flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-md border shadow-sm",
            "bg-primary text-primary-foreground ring-2 ring-primary/10"
          )}>
            <Bot className="h-6 w-6" />
          </div>
        ) : (
          <Avatar className="h-12 w-12 ring-2 ring-primary/10">
            <AvatarImage 
              src={profile?.avatar_url || ''} 
              alt={profile?.full_name || 'User'} 
              className="object-cover"
            />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className={cn(
        "flex flex-col gap-1 min-w-0 w-full max-w-[85%]",
        isBot ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2 w-full shadow-sm",
          isBot 
            ? "bg-muted/80 text-foreground backdrop-blur-sm" 
            : "bg-primary text-primary-foreground"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </p>
        </div>
        {showTimestamp && timestamp && (
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {format(new Date(timestamp), "d MMMM 'à' HH:mm", { locale: fr })}
          </span>
        )}
      </div>
    </motion.div>
  );
});