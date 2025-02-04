import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, Send, Loader2, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening = false,
  isThinking = false,
  className,
  placeholder = "Comment puis-je vous aider aujourd'hui ?",
}: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isThinking) {
        onSend();
      }
    }
  };

  return (
    <motion.div 
      className={cn(
        "relative flex items-end gap-2 p-4",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      initial={false}
      animate={{
        y: isFocused ? -8 : 0,
        scale: isFocused ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="min-h-[44px] w-full resize-none rounded-lg pr-20 text-base focus-visible:ring-1"
          rows={1}
          disabled={isThinking}
        />
        
        <div className="absolute bottom-1 right-1 flex items-center gap-1">
          {onVoiceInput && (
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={onVoiceInput}
              className="h-8 w-8"
              disabled={isThinking}
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Mic className="h-4 w-4" />
              </motion.div>
            </Button>
          )}
          
          <Button
            type="button"
            size="icon"
            onClick={onSend}
            className={cn(
              "h-8 w-8",
              value.trim() && !isThinking && "hover:scale-105"
            )}
            disabled={!value.trim() || isThinking}
          >
            {isThinking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}