import { cn } from "@/lib/utils";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput: () => void;
  isListening: boolean;
  isThinking: boolean;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onVoiceInput, 
  isListening,
  isThinking 
}: ChatInputProps) {
  return (
    <div className="flex gap-2 relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !isThinking && onSend()}
        placeholder="Écrivez votre message..."
        className="flex-grow pr-20"
        disabled={isThinking}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
        <Button
          onClick={onVoiceInput}
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-victaure-blue/10",
            isListening && "bg-victaure-blue/20",
            isThinking && "opacity-50 cursor-not-allowed"
          )}
          disabled={isThinking}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          onClick={onSend}
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-victaure-blue/10",
            isThinking && "opacity-50 cursor-not-allowed"
          )}
          disabled={isThinking}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}