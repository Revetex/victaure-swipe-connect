import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";

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
        className="min-h-[60px] resize-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <div className="flex gap-2">
        <Button
          size="icon"
          variant={isListening ? "destructive" : "secondary"}
          onClick={onVoiceInput}
          disabled={isThinking}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={onSend}
          disabled={!value.trim() || isThinking}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}