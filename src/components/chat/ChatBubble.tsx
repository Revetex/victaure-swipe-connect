import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface ChatBubbleProps {
  content: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  timestamp: Date;
  isCurrentUser: boolean;
}

export function ChatBubble({ content, sender, timestamp, isCurrentUser }: ChatBubbleProps) {
  const isAssistant = sender.id === 'assistant';

  return (
    <div className={cn(
      "flex gap-2 mb-4",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 shrink-0">
        {isAssistant ? (
          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <>
            <AvatarImage src={sender.avatar_url} alt={sender.full_name} />
            <AvatarFallback>
              {sender.full_name?.slice(0, 2).toUpperCase() || "??"}
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={cn(
        "flex flex-col max-w-[80%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-2 break-words",
          isCurrentUser 
            ? "bg-primary text-primary-foreground" 
            : isAssistant
              ? "bg-primary/10"
              : "bg-muted",
        )}>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {format(timestamp, "HH:mm", { locale: fr })}
        </span>
      </div>
    </div>
  );
}