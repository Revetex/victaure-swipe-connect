import { Bot, Brain, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onClearChat?: () => void;
  isThinking: boolean;
  onBack?: () => void;
}

export function ChatHeader({ onClearChat, isThinking, onBack }: ChatHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center p-4 border-b bg-background/80 backdrop-blur-sm"
    >
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

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

      {onClearChat && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          className="ml-auto"
        >
          <ArrowLeft className="h-5 w-5 rotate-45" />
        </Button>
      )}
    </motion.div>
  );
}