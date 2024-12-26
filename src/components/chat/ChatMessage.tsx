import { UserRound, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
}

export function ChatMessage({ content, sender, thinking }: ChatMessageProps) {
  return (
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
  );
}