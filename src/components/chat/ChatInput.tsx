
import React, { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isThinking?: boolean;
  isListening?: boolean;
  onVoiceInput?: () => void;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isThinking,
  isListening,
  onVoiceInput,
  placeholder = "Écrivez votre message..."
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  return (
    <div className="flex items-end gap-2 bg-background rounded-lg">
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className={cn(
            "w-full resize-none bg-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
            "min-h-[44px] max-h-[200px]"
          )}
          style={{
            height: 'auto',
            minHeight: '44px',
            maxHeight: '200px'
          }}
        />
      </div>

      <div className="flex items-center gap-2 pb-1">
        {onVoiceInput && (
          <Button
            size="icon"
            variant={isListening ? "default" : "ghost"}
            onClick={onVoiceInput}
            className="rounded-full h-10 w-10"
            disabled={isThinking}
          >
            <Mic className={cn("h-5 w-5", isListening && "text-white")} />
          </Button>
        )}

        <Button
          size="icon"
          onClick={onSend}
          disabled={!value.trim() || isThinking}
          className="rounded-full h-10 w-10"
        >
          {isThinking ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
