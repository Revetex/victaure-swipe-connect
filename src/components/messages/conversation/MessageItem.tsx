
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "@/types/messages";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 w-full px-4 py-2",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 ring-2 flex-shrink-0",
        isOwnMessage ? "ring-primary/20" : "ring-muted"
      )}>
        <AvatarImage
          src={message.sender.avatar_url || "/user-icon.svg"}
          alt={message.sender.full_name}
          className="h-full w-full object-cover"
        />
        <AvatarFallback>{message.sender.full_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col gap-1.5 max-w-[70%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "flex items-center gap-2",
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs font-medium text-muted-foreground">
            {message.sender.full_name}
          </span>
        </div>

        <div className={cn(
          "rounded-2xl px-4 py-2.5 shadow-sm",
          isOwnMessage 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted hover:bg-muted/80 transition-colors rounded-tl-none"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-1",
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.created_at), "HH:mm", { locale: fr })}
          </span>
          {isOwnMessage && (
            message.read ? 
              <CheckCheck className="h-3 w-3 text-primary" /> : 
              <Check className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
