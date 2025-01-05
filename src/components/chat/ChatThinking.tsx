import { Bot } from "lucide-react";

export function ChatThinking() {
  return (
    <div className="flex items-center gap-2 p-4 text-muted-foreground animate-pulse">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <span className="text-sm">M. Victaure réfléchit</span>
      <span className="flex gap-1">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce delay-100">.</span>
        <span className="animate-bounce delay-200">.</span>
      </span>
    </div>
  );
}