
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Check, Clock, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  timestamp?: string;
  isRead?: boolean;
  reaction?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export function ChatMessage({ 
  content, 
  sender, 
  timestamp, 
  isRead,
  reaction,
  status = 'sent'
}: ChatMessageProps) {
  const { profile } = useProfile();
  const isAssistant = sender === "assistant";

  const renderMessageStatus = () => {
    if (isAssistant) return null;
    
    switch (status) {
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'delivered':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      default:
        return <Check className="h-3 w-3 text-muted-foreground/50" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex w-full gap-3 px-4 py-3 rounded-lg",
        isAssistant ? "bg-muted/30" : "bg-background"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 ring-2 flex-shrink-0",
        isAssistant ? "ring-primary/20" : "ring-muted"
      )}>
        {isAssistant ? (
          <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <AvatarImage
            src={profile?.avatar_url || "/user-icon.svg"}
            alt="Your avatar"
            className="object-cover"
          />
        )}
        <AvatarFallback>
          {isAssistant ? "AI" : profile?.full_name?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-sm font-medium",
            isAssistant ? "text-primary" : "text-foreground"
          )}>
            {isAssistant ? "M. Victaure" : "Vous"}
          </span>
          {timestamp && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(timestamp), "HH:mm", { locale: fr })}</span>
              {renderMessageStatus()}
            </div>
          )}
        </div>

        <div className={cn(
          "rounded-xl p-3",
          isAssistant 
            ? "bg-muted/50 text-foreground" 
            : "bg-primary text-primary-foreground"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>

        {reaction && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            {reaction}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
