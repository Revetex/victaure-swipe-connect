
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Mic, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ChatInput({
  value = "",
  onChange = () => {},
  onSend = () => {},
  onVoiceInput = () => {},
  isListening = false,
  isThinking = false,
  placeholder = "Écrivez votre message...",
  className = "",
  disabled = false
}: ChatInputProps) {
  return (
    <div className={`relative flex items-end gap-2 ${className}`}>
      <div className="relative flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[60px] pr-24 resize-none rounded-xl focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={disabled}
        />
        <AnimatePresence>
          <motion.div 
            className="absolute bottom-2 right-2 flex gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant={isListening ? "destructive" : "secondary"}
                onClick={onVoiceInput}
                disabled={isThinking || disabled}
                className="rounded-full shadow-sm hover:shadow-md transition-shadow h-8 w-8"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
