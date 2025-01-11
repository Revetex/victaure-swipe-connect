import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
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
    <div className={cn("flex flex-col gap-2 p-4 border-t bg-background/95 backdrop-blur-sm", className)}>
      <div className="relative flex items-center gap-2">
        {onVoiceInput && (
          <Button
            type="button"
            size="icon"
            variant={isListening ? "default" : "ghost"}
            onClick={onVoiceInput}
            className="h-10 w-10 shrink-0"
            disabled={isThinking}
          >
            <motion.div
              animate={isListening ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Mic className="h-5 w-5" />
            </motion.div>
          </Button>
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
            className="min-h-[44px] max-h-[200px] resize-none py-3 text-base focus-visible:ring-1"
            disabled={isThinking}
          />
        </div>

        <Button
          type="button"
          size="icon"
          onClick={() => {
            if (value.trim() && !isThinking) {
              onSend();
            }
          }}
          className={cn(
            "h-10 w-10 shrink-0",
            value.trim() && !isThinking && "bg-primary hover:bg-primary/90"
          )}
          disabled={!value.trim() || isThinking}
        >
          {isThinking ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}