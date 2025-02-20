
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  isLoading = false,
  disabled = false,
  placeholder = "Écrivez votre message..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      await onSendMessage(message);
      setMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [message, isLoading, onSendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 border-t">
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-4"
      >
        <div className={cn(
          "flex items-end gap-2 bg-background rounded-lg p-2",
          "border shadow-sm"
        )}>
          <Input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled || isLoading}
            className={cn(
              "shrink-0 h-10 w-10",
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
    </div>
  );
}
