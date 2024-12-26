import { UserRound, Bot } from "lucide-react";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  thinking?: boolean;
}

export function ChatMessage({ content, sender, thinking }: ChatMessageProps) {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg flex items-center gap-2 ${
          sender === "user"
            ? "bg-victaure-blue text-white"
            : "bg-victaure-metal/40"
        } ${thinking ? "animate-pulse" : ""}`}
      >
        {sender === "assistant" && !thinking && (
          <Bot className="h-4 w-4 shrink-0" />
        )}
        {content}
        {sender === "user" && (
          <UserRound className="h-4 w-4 shrink-0" />
        )}
      </div>
    </div>
  );
}