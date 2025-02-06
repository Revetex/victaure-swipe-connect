
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
  avatar_url?: string;
  timestamp?: string;
  isRead?: boolean;
}

export function ChatMessage({ content, sender, avatar_url, timestamp, isRead }: ChatMessageProps) {
  const { profile } = useProfile();
  const isAssistant = sender === "assistant";

  const messageVariants = {
    initial: { 
      opacity: 0, 
      x: isAssistant ? -20 : 20,
      y: 10 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.01,
      transition: {
        duration: 0.2
      }
    }
  };

  const messageContentVariants = {
    initial: { scale: 0.95 },
    animate: { 
      scale: 1,
      transition: {
        duration: 0.2,
        delay: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={messageVariants}
      className={cn(
        "flex w-full gap-4 p-4",
        isAssistant 
          ? "bg-muted/30 hover:bg-muted/50 transition-colors" 
          : "bg-background hover:bg-muted/10 transition-colors"
      )}
    >
      <Avatar className={cn(
        "h-10 w-10 ring-2 transition-shadow",
        isAssistant 
          ? "ring-primary/20 hover:ring-primary/30" 
          : "ring-muted hover:ring-muted/80"
      )}>
        {isAssistant ? (
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Bot className="h-6 w-6 text-primary" />
          </motion.div>
        ) : (
          <AvatarImage
            src={profile?.avatar_url || "/user-icon.svg"}
            alt="Your avatar"
            className="h-full w-full object-cover"
          />
        )}
        <AvatarFallback>
          {isAssistant ? "AI" : profile?.full_name?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Clock className="h-3 w-3" />
              {format(new Date(timestamp), 'HH:mm', { locale: fr })}
              {!isAssistant && (
                <div className="flex items-center">
                  {isRead ? (
                    <CheckCheck className="h-3 w-3 text-primary" />
                  ) : (
                    <Check className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <motion.div
          variants={messageContentVariants}
          className={cn(
            "rounded-xl p-4 shadow-sm transition-all duration-200",
            isAssistant 
              ? "bg-card hover:shadow-md border-primary/10 rounded-tl-none" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 rounded-tr-none"
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
