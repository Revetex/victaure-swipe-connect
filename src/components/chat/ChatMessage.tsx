
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/types/messages";
import { useUser } from "@/hooks/useUser";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useUser();
  
  if (!message || !user) return null;
  
  const isOwnMessage = message.sender_id === user.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-full gap-3 items-start mb-3",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage 
            src={message.sender?.avatar_url || "/user-icon.svg"}
            alt={message.sender?.full_name || "User"}
          />
          <AvatarFallback>
            {message.sender?.full_name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "group flex flex-col gap-1 max-w-[75%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        {!isOwnMessage && (
          <span className="text-xs text-muted-foreground px-3">
            {message.sender?.full_name}
          </span>
        )}
        
        <div className={cn(
          "px-4 py-2.5 rounded-2xl text-sm whitespace-normal break-words w-fit max-w-full",
          isOwnMessage 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-muted rounded-tl-sm"
        )}>
          {message.content}
        </div>
        
        <div className={cn(
          "flex items-center gap-1.5 px-3",
          isOwnMessage ? "flex-row" : "flex-row-reverse"
        )}>
          <time className="text-[10px] text-muted-foreground">
            {format(new Date(message.created_at), "HH:mm", { locale: fr })}
          </time>
          {isOwnMessage && (
            <span className="text-primary">
              {message.status === 'sent' && <Check className="h-3 w-3" />}
              {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
              {message.status === 'read' && <CheckCheck className="h-3 w-3" />}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
