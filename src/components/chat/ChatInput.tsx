import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

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

export function ChatInput({
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isThinking) {
        onSend();
      }
    }
  };

  return (
    <div className={cn(
      "fixed bottom-[4.5rem] left-0 right-0 bg-background/95 backdrop-blur-md border-t z-50 pb-safe",
      className
    )}>
      <div className="relative flex items-center gap-1.5 p-2 max-w-3xl mx-auto w-full">
        {onVoiceInput && (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={onVoiceInput}
              className={cn(
                "h-8 w-8 shrink-0 rounded-full transition-all duration-200",
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
                <Mic className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        )}

        <div className="relative flex-1">
          <Textarea
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= maxLength) {
                onChange(newValue);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[36px] max-h-[120px] resize-none py-2 text-base focus-visible:ring-1 pr-12 rounded-full bg-muted/30 border-muted/50 placeholder:text-muted-foreground/50"
            disabled={isThinking}
          />
          <AnimatePresence mode="wait">
            {value.trim() && !isThinking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Button
                  type="button"
                  size="icon"
                  onClick={onSend}
                  className="h-6 w-6 rounded-full bg-primary hover:bg-primary/90 shadow-sm"
                >
                  <Send className="h-3 w-3 text-primary-foreground" />
                </Button>
              </motion.div>
            )}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/70" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}