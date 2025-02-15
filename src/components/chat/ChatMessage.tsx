
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
      className={cn(
        "flex w-full gap-4",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 ring-2 flex-shrink-0",
        isOwnMessage ? "ring-primary" : "ring-muted"
      )}>
        <AvatarImage 
          src={message.sender?.avatar_url || "/user-icon.svg"}
          alt={message.sender?.full_name || "User"}
        />
        <AvatarFallback>
          {message.sender?.full_name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <Card className={cn(
          "p-3 relative group",
          isOwnMessage 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
            <time className="text-xs">
              {format(new Date(message.created_at), "HH:mm", { locale: fr })}
            </time>
            {isOwnMessage && (
              <span>
                {message.status === 'sent' && <Check className="h-3 w-3" />}
                {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
              </span>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
