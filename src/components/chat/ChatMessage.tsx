import { UserRound, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
  showTimestamp?: boolean;
  timestamp?: Date;
}

export function ChatMessage({ 
  content, 
  sender, 
  thinking,
  showTimestamp,
  timestamp 
}: ChatMessageProps) {
  return (
    <div className="space-y-2">
      {showTimestamp && timestamp && (
        <div className="text-center">
          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
            {format(new Date(timestamp), "d MMMM à HH:mm", { locale: fr })}
          </span>
        </div>
      )}
      <div 
        className={cn(
          "flex animate-slide-in transition-all duration-300",
          sender === "user" ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] p-3 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-300",
            sender === "user"
              ? "bg-victaure-blue text-white hover:shadow-md hover:bg-victaure-blue-dark"
              : "bg-victaure-metal/40 hover:bg-victaure-metal/50 hover:shadow-md",
            thinking ? "animate-pulse" : ""
          )}
        >
          {sender === "assistant" && !thinking && (
            <Bot className="h-4 w-4 shrink-0" />
          )}
          <span className={thinking ? "animate-pulse" : ""}>{content}</span>
          {sender === "user" && (
            <UserRound className="h-4 w-4 shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}