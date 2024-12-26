import { Bot, Brain, Sparkles, Wand2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onClearChat: () => void;
  isThinking: boolean;
}

export function ChatHeader({ onClearChat, isThinking }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 relative border-b border-victaure-blue/10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={`h-12 w-12 rounded-full bg-victaure-blue/20 flex items-center justify-center transition-all duration-300 ${isThinking ? 'bg-victaure-blue/30' : 'hover:bg-victaure-blue/30'}`}>
            <Bot className={`h-6 w-6 text-victaure-blue ${isThinking ? 'animate-pulse' : ''}`} />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-victaure-green/20 flex items-center justify-center">
            <Brain className={`h-3 w-3 text-victaure-green ${isThinking ? 'animate-spin' : ''}`} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Mr. Victaure
            <Sparkles className="h-4 w-4 text-victaure-orange animate-glow" />
          </h2>
          <p className="text-sm text-victaure-gray flex items-center gap-1">
            <Wand2 className="h-3 w-3" />
            {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClearChat}
        className="hover:bg-victaure-blue/10"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}