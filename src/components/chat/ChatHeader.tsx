import { Bot, Brain, ArrowLeft, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatHeaderProps {
  onClearChat: () => void;
  isThinking: boolean;
}

export function ChatHeader({ onClearChat, isThinking }: ChatHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 ${isThinking ? 'animate-pulse' : ''}`}>
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <Brain className={`h-3 w-3 text-green-500 ${isThinking ? 'animate-spin' : ''}`} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Mr. Victaure</h2>
          <p className="text-sm text-muted-foreground">
            {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
          </p>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearChat}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Effacer la conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
}