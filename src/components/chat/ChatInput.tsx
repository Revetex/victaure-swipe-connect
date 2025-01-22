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
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

export const ChatInput = memo(function ChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening = false,
  isThinking = false,
  placeholder = "Écrivez votre message...",
  className,
  maxLength = 1000
}: ChatInputProps) {
  const [rows, setRows] = useState(1);

  useEffect(() => {
    const lineCount = (value.match(/\n/g) || []).length + 1;
    setRows(Math.min(lineCount, 5));
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

  const handleSendClick = useCallback(() => {
    if (value.trim() && !isThinking) {
      onSend();
    }
  }, [value, isThinking, onSend]);

  return (
    <div className={cn("p-1.5", className)}>
      <div className="relative flex items-center gap-1.5">
        {onVoiceInput && (
          <button
            onClick={onVoiceInput}
            className={cn(
              "shrink-0 p-2 text-muted-foreground/60 hover:text-primary transition-colors",
              isListening && "text-primary animate-pulse"
            )}
            disabled={isThinking}
          >
            <Mic className="h-5 w-5" />
          </button>
        )}
        
        <div className="relative flex-1">
          <Textarea
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[40px] max-h-[120px] w-full pr-12 py-2.5 resize-none text-sm focus-visible:ring-1 rounded-xl bg-muted/30 border-muted/50 placeholder:text-muted-foreground/50"
            style={{
              height: `${Math.max(40, Math.min(rows * 24, 120))}px`
            }}
          />
          
          <AnimatePresence>
            {value.trim() && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={handleSendClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:text-primary/80 transition-colors disabled:opacity-50 bg-background/80 rounded-lg shadow-sm"
                disabled={isThinking}
              >
                {isThinking ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});