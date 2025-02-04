import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "@/types/messages";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1 max-w-[80%]",
      isOwnMessage ? "ml-auto items-end" : "mr-auto items-start"
    )}>
      <div className={cn(
        "rounded-lg px-4 py-2",
        isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        <p className="text-sm">{message.content}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {format(new Date(message.created_at), "HH:mm", { locale: fr })}
        {isOwnMessage && (
          message.read ? 
            <CheckCheck className="h-3 w-3 text-primary" /> : 
            <Check className="h-3 w-3" />
        )}
      </div>
    </div>
  );
}