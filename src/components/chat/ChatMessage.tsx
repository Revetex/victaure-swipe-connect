
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
    <div className={cn(
      "flex w-full gap-2 items-end mb-1",
      isOwnMessage ? "flex-row-reverse" : "flex-row"
    )}>
      {!isOwnMessage && (
        <Avatar className="h-6 w-6 flex-shrink-0">
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
        "group max-w-[75%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-3 py-2 rounded-2xl text-sm break-words",
          isOwnMessage 
            ? "bg-primary text-primary-foreground rounded-br-sm" 
            : "bg-muted rounded-bl-sm"
        )}>
          {message.content}
        </div>
        
        <div className={cn(
          "flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground",
          isOwnMessage ? "justify-end" : "justify-start"
        )}>
          <time>
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
    </div>
  );
}
