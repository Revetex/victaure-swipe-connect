
import React, { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function ChatInput({ 
  onSendMessage, 
  isLoading = false,
  disabled = false,
  placeholder = "Écrivez votre message...",
  value = "",
  onChange
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;

    try {
      await onSendMessage(value);
      onChange?.("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [value, isLoading, onSendMessage, onChange]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="flex-1"
        />
        <Button 
          type="submit"
          size="icon"
          disabled={!value.trim() || disabled || isLoading}
          className={cn(
            "shrink-0",
            isLoading && "cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
