
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  isThinking?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ChatInput({
  value = "",
  onChange = () => {},
  onSend = () => {},
  isThinking = false,
  placeholder = "Écrivez votre message...",
  className = "",
  disabled = false
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isThinking && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className={`relative flex items-end gap-2 ${className}`}>
      <div className="relative flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[60px] pr-12 resize-none rounded-xl focus:ring-2 focus:ring-primary/20 bg-background/50"
          onKeyDown={handleKeyDown}
          disabled={disabled || isThinking}
        />
        <AnimatePresence>
          <motion.div 
            className="absolute bottom-2 right-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Button
              size="icon"
              onClick={onSend}
              disabled={!value.trim() || isThinking || disabled}
              className="rounded-full shadow-sm hover:shadow-md transition-shadow h-8 w-8"
            >
              {isThinking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
