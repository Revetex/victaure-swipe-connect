import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Écrivez votre message..."
          disabled={isThinking}
        />
        {onVoiceInput && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onVoiceInput}
            className={isListening ? "text-primary" : ""}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
        <Button type="submit" size="icon" disabled={!value.trim() || isThinking}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}