import { cn } from "@/lib/utils";
import { Send, Mic, Loader2 } from "lucide-react";
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
  disabled?: boolean;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onVoiceInput, 
  isListening,
  isThinking,
  disabled 
}: ChatInputProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-2 relative bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !isThinking && !disabled && onSend()}
        placeholder={disabled ? "Connexion en cours..." : "Écrivez votre message..."}
        className="flex-grow pr-20 bg-transparent border-muted"
        disabled={disabled || isThinking}
      />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1">
        <Button
          onClick={onVoiceInput}
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-primary/10 transition-all duration-300 rounded-full",
            isListening && "bg-primary/20 animate-pulse",
            (isThinking || disabled) && "opacity-50 cursor-not-allowed"
          )}
          disabled={isThinking || disabled}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Mic className="h-4 w-4 text-primary" />
            </motion.div>
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={onSend}
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-primary/10 transition-all duration-300 rounded-full",
            (isThinking || disabled) && "opacity-50 cursor-not-allowed"
          )}
          disabled={isThinking || disabled}
        >
          {isThinking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}