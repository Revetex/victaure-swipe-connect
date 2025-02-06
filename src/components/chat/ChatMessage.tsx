
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Bot, Check, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  avatar_url?: string;
  timestamp?: string;
  isRead?: boolean;
}

export function ChatMessage({ content, sender, avatar_url, timestamp, isRead }: ChatMessageProps) {
  const { profile } = useProfile();
  const isAssistant = sender === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 p-4",
        isAssistant 
          ? "bg-muted/30 hover:bg-muted/50 transition-colors" 
          : "bg-background"
      )}
    >
      <Avatar className={cn(
        "h-10 w-10 ring-2 transition-shadow",
        isAssistant ? "ring-primary/20" : "ring-muted"
      )}>
        {isAssistant ? (
          <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
        ) : (
          <img
            src={profile?.avatar_url || "/user-icon.svg"}
            alt="Your avatar"
            className="h-full w-full object-cover rounded-full"
          />
        )}
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm font-medium",
            isAssistant ? "text-primary" : "text-foreground"
          )}>
            {isAssistant ? "M. Victaure" : "Vous"}
          </p>
          {timestamp && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(new Date(timestamp), 'HH:mm', { locale: fr })}
              {!isAssistant && (
                <div className="flex items-center">
                  {isRead ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Check className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={cn(
            "rounded-xl p-4 shadow-sm transition-all duration-200",
            isAssistant 
              ? "bg-card hover:shadow-md border-primary/10" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
