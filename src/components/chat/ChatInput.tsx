import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Mic, Send } from "lucide-react";
import { motion } from "framer-motion";

export interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  value = "",
  onChange = () => {},
  onSend = () => {},
  onVoiceInput = () => {},
  isListening = false,
  isThinking = false,
  placeholder = "Écrivez votre message...",
  className = ""
}: ChatInputProps) {
  return (
    <div className={`relative flex items-end gap-2 ${className}`}>
      <div className="relative flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[60px] pr-24 resize-none rounded-xl focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              variant={isListening ? "destructive" : "secondary"}
              onClick={onVoiceInput}
              disabled={isThinking}
              className="rounded-full shadow-sm hover:shadow-md transition-shadow h-8 w-8"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              onClick={onSend}
              disabled={!value.trim() || isThinking}
              className="rounded-full shadow-sm hover:shadow-md transition-shadow h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}