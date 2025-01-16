import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, memo } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
  placeholder?: string;
  maxLength?: number;
}

export const ChatInput = memo(function ChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening = false,
  isThinking = false,
  className,
  placeholder = "Posez vos questions à M. Victaure...",
  maxLength = 1000,
}: ChatInputProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (value) {
      setIsTyping(true);
      if (typingTimeout) clearTimeout(typingTimeout);
      
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      
      setTypingTimeout(timeout);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isThinking) {
        onSend();
      }
    }
  }, [value, isThinking, onSend]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  }, [maxLength, onChange]);

  return (
    <div className={cn("p-1.5", className)}>
      <div className="relative flex items-center gap-1.5">
        {onVoiceInput && (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={onVoiceInput}
              className={cn(
                "h-6 w-6 shrink-0 rounded-full transition-all duration-200",
                isListening ? "bg-primary text-primary-foreground shadow-lg scale-110" : "opacity-70 hover:opacity-100"
              )}
              disabled={isThinking}
            >
              <motion.div
                animate={isListening ? { 
                  scale: [1, 1.2, 1],
                  backgroundColor: ['hsl(var(--primary))', 'hsl(var(--primary))', 'hsl(var(--primary))']
                } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Mic className="h-3 w-3" />
              </motion.div>
            </Button>
          </motion.div>
        )}

        <div className="relative flex-1">
          <Textarea
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[28px] max-h-[28px] w-full pr-10 py-1 resize-none text-sm focus-visible:ring-1 rounded-full bg-muted/30 border-muted/50 placeholder:text-muted-foreground/50"
            disabled={isThinking}
          />
          
          <AnimatePresence mode="wait">
            {isThinking ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-3 w-3 text-muted-foreground/70" />
                </motion.div>
              </motion.div>
            ) : (
              <Button
                type="button"
                size="icon"
                onClick={onSend}
                disabled={!value.trim()}
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full",
                  "bg-primary hover:bg-primary/90 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <ArrowRight className="h-3 w-3 text-primary-foreground" />
              </Button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});