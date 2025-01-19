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
    <div className="flex items-end gap-2 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[44px] max-h-[200px] resize-none flex-1"
        disabled={isThinking}
      />
      <div className="flex gap-2 shrink-0">
        {onVoiceInput && (
          <Button
            type="button"
            size="icon"
            variant={isListening ? "default" : "outline"}
            onClick={onVoiceInput}
            className={`h-[44px] w-[44px] ${isListening ? "bg-primary" : ""}`}
            disabled={isThinking}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
        <Button
          type="submit"
          size="icon"
          onClick={onSend}
          disabled={!value.trim() || isThinking}
          className="h-[44px] w-[44px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}