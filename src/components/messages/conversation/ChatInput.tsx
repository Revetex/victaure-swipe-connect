
import React, { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isThinking?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isThinking,
  placeholder = "Écrivez votre message..."
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    onChange(textarea.value);
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={value}
        onChange={handleTextareaInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isThinking}
        className={cn(
          "w-full resize-none bg-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
          "min-h-[44px] max-h-[200px]",
          isThinking && "opacity-50 cursor-not-allowed"
        )}
        style={{
          height: 'auto',
          minHeight: '44px',
          maxHeight: '200px'
        }}
      />
      <Button
        size="icon"
        onClick={onSend}
        disabled={!value.trim() || isThinking}
        className="rounded-full h-10 w-10 flex-shrink-0"
        title="Envoyer"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
