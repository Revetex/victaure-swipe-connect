
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  isThinking?: boolean;
  isListening?: boolean;
  onVoiceInput?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ChatInput({
  value = "",
  onChange = () => {},
  onSend = () => {},
  isThinking = false,
  isListening = false,
  onVoiceInput,
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
          className="min-h-[60px] pr-24 resize-none rounded-xl focus:ring-2 focus:ring-primary/20 bg-background/50"
          onKeyDown={handleKeyDown}
          disabled={disabled || isThinking}
        />
        <AnimatePresence>
          <motion.div 
            className="absolute bottom-2 right-2 flex gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {onVoiceInput && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onVoiceInput}
                disabled={isThinking || disabled}
                className="rounded-full h-8 w-8"
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-destructive" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
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
