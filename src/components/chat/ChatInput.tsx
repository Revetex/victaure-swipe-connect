import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (content: string) => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
}

export function ChatInput({ 
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening,
  isThinking
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isThinking) {
      onSend(value.trim());
      onChange("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Écrivez votre message..."
          disabled={isThinking}
          className="pr-24"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {onVoiceInput && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onVoiceInput}
                className={`transition-colors ${isListening ? 'text-primary' : ''}`}
              >
                <Mic className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              size="icon"
              disabled={!value.trim() || isThinking}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </form>
  );
}