import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
  placeholder?: string;
  maxLength?: number;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isListening = false,
  isThinking = false,
  className,
  placeholder = "Comment puis-je vous aider aujourd'hui ?",
  maxLength = 1000,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isThinking) {
        try {
          onSend();
        } catch (error) {
          console.error("Error sending message:", error);
          toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
        }
      }
    }
  };

  const handleSendClick = () => {
    if (value.trim() && !isThinking) {
      try {
        onSend();
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
      }
    }
  };

  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isAtLimit = characterCount >= maxLength;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative w-full">
        <Textarea
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length <= maxLength) {
              onChange(newValue);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-24 min-h-[60px] max-h-[200px] resize-none text-foreground focus-visible:ring-primary bg-background w-full"
          disabled={isThinking}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {onVoiceInput && (
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={onVoiceInput}
              className="h-8 w-8"
              disabled={isThinking}
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Mic className="h-4 w-4" />
              </motion.div>
            </Button>
          )}
          <Button
            type="button"
            size="icon"
            onClick={handleSendClick}
            className={cn(
              "h-8 w-8 transition-transform",
              value.trim() && !isThinking && "hover:scale-105"
            )}
            disabled={!value.trim() || isThinking}
          >
            {isThinking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex justify-end items-center px-1 text-xs text-muted-foreground">
        <span className={cn(
          "transition-colors",
          isNearLimit && "text-warning",
          isAtLimit && "text-destructive"
        )}>
          {characterCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}