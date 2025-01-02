import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceInput?: () => void;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
  placeholder?: string;
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

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative w-full bg-background border rounded-lg shadow-sm">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-24 min-h-[60px] max-h-[200px] resize-none text-foreground focus-visible:ring-primary bg-background w-full border-0"
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
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}