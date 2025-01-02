import { Bot } from "lucide-react";

export function ChatThinking() {
  return (
    <div className="flex items-center gap-2 p-4 text-muted-foreground">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground ring-2 ring-primary/10">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="rounded-lg bg-muted/80 px-4 py-2 text-sm">
          <span>M. Victaure réfléchit</span>
          <span className="inline-flex gap-1 ml-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}