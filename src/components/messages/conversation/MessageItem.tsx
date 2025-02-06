
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "@/types/messages";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";

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
        "flex gap-3 w-full",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 mt-1">
        <img
          src={message.sender.avatar_url || "/user-icon.svg"}
          alt={message.sender.full_name}
          className="h-full w-full object-cover rounded-full"
        />
      </Avatar>

      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isOwnMessage ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-2.5 shadow-sm",
          isOwnMessage 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted hover:bg-muted/80 transition-colors"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>

        <div className="flex items-center gap-2 px-2">
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
