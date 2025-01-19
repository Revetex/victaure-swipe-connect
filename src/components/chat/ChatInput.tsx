import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import { useEffect, useRef } from "react";

export interface ChatInputProps {
  value: string;
  onChange: (message: string) => void;
  onSend: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening = false,
  isThinking = false,
  placeholder = "Écrivez votre message..."
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 flex items-end gap-2">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[44px] max-h-[200px] resize-none"
        disabled={isThinking}
      />
      <div className="flex gap-2">
        {onVoiceInput && (
          <Button
            type="button"
            size="icon"
            variant={isListening ? "default" : "outline"}
            onClick={onVoiceInput}
            className={isListening ? "bg-primary" : ""}
            disabled={isThinking}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="submit"
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