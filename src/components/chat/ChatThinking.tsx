import { Bot } from "lucide-react";

export function ChatThinking() {
  return (
    <div className="flex items-center gap-2 p-2 text-muted-foreground animate-pulse">
      <Bot className="h-4 w-4" />
      <span>M. Victaure réfléchit...</span>
      <span className="flex gap-1">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce delay-100">.</span>
        <span className="animate-bounce delay-200">.</span>
      </span>
    </div>
  );
}