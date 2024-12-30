import { Bot, Brain, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  onClearChat: () => void;
  isThinking: boolean;
}

export function ChatHeader({ isThinking }: ChatHeaderProps) {
  return (
    <div className="flex items-center p-4 relative border-b border-primary/10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div 
            className={cn(
              "h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-300",
              isThinking ? "bg-primary/30" : "hover:bg-primary/30"
            )}
          >
            <img
              src="/lovable-uploads/193c092a-9104-486d-a72a-0d882d86ce20.png"
              alt="Mr. Victaure"
              className={cn(
                "h-10 w-10 object-contain",
                isThinking && "animate-pulse"
              )}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <Brain className={cn(
              "h-3 w-3 text-green-500",
              isThinking && "animate-spin"
            )} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Mr. Victaure
            <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Wand2 className="h-3 w-3" />
            {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
          </p>
        </div>
      </div>
    </div>
  );
}