import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput: () => void;
  isListening: boolean;
}

export function ChatInput({ value, onChange, onSend, onVoiceInput, isListening }: ChatInputProps) {
  return (
    <div className="flex gap-2 relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onSend()}
        placeholder="Écrivez votre message..."
        className="flex-grow pr-20"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
        <Button
          onClick={onVoiceInput}
          variant="ghost"
          size="icon"
          className={`hover:bg-victaure-blue/10 ${
            isListening ? "bg-victaure-blue/20" : ""
          }`}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          onClick={onSend}
          variant="ghost"
          size="icon"
          className="hover:bg-victaure-blue/10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}