
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  isThinking?: boolean;
  isListening?: boolean;
  onVoiceInput?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Écrivez votre message...",
  isThinking = false,
  isListening = false,
  onVoiceInput
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isThinking}
        className="flex-1"
      />
      {onVoiceInput && (
        <Button
          variant="outline"
          size="icon"
          onClick={onVoiceInput}
          disabled={isThinking}
          className={isListening ? "bg-red-100 hover:bg-red-200" : ""}
        >
          <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
        </Button>
      )}
      <Button
        onClick={onSend}
        disabled={isThinking || !value.trim()}
        size="icon"
      >
        {isThinking ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-4 w-4" />
          </motion.div>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
