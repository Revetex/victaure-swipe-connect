import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

interface ChatMessageProps {
  content: string;
  sender: "user" | "assistant";
  avatar_url?: string;
}

export function ChatMessage({ content, sender, avatar_url }: ChatMessageProps) {
  const isAssistant = sender === "assistant";

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4",
        isAssistant ? "bg-muted/50" : "bg-background"
      )}
    >
      <Avatar className="h-8 w-8">
        {isAssistant ? (
          <Bot className="h-5 w-5 text-primary" />
        ) : (
          avatar_url && (
            <img
              src={avatar_url}
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          )
        )}
      </Avatar>
      <Card className={cn(
        "flex-1 p-4 shadow-sm",
        isAssistant ? "bg-background" : "bg-primary/5"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </Card>
    </div>
  );
}