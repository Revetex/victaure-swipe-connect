import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
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
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[60px] resize-none rounded-xl focus:ring-2 focus:ring-primary/20"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <div className="flex gap-2">
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            variant={isListening ? "destructive" : "secondary"}
            onClick={onVoiceInput}
            disabled={isThinking}
            className="rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            onClick={onSend}
            disabled={!value.trim() || isThinking}
            className="rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Send className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}