import { cn } from "@/lib/utils";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput: () => void;
  isListening: boolean;
  isThinking: boolean;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onVoiceInput, 
  isListening,
  isThinking 
}: ChatInputProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-2 relative"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !isThinking && onSend()}
        placeholder="Écrivez votre message..."
        className="flex-grow pr-20"
        disabled={isThinking}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
        <Button
          onClick={onVoiceInput}
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-primary/10 transition-all duration-300",
            isListening && "bg-primary/20 animate-pulse",
            isThinking && "opacity-50 cursor-not-allowed"
          )}
          disabled={isThinking}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          onClick={onSend}
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-primary/10 transition-all duration-300",
            isThinking && "opacity-50 cursor-not-allowed"
          )}
          disabled={isThinking}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}