
import { Message } from "@/types/messages";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      <UserAvatar
        user={message.sender}
        className="h-8 w-8 flex-shrink-0"
      />
      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isOwn && "items-end"
      )}>
        <div className={cn(
          "rounded-lg px-3 py-2",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {format(new Date(message.created_at), "HH:mm", { locale: fr })}
        </span>
      </div>
    </div>
  );
}
