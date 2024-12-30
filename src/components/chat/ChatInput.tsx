import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, Send } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening = false,
  isThinking = false,
  className,
}: ChatInputProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (value.trim() && !isThinking) {
                onSend();
              }
            }
          }}
          placeholder="Écrivez votre message..."
          className="pr-24 min-h-[80px] resize-none"
          disabled={isThinking}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
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
            className="h-8 w-8"
            disabled={!value.trim() || isThinking}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}