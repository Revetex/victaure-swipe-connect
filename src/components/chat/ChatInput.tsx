import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, Send, Loader2 } from "lucide-react";
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
    <div className={cn("flex flex-col gap-0.5 relative", className)}>
      <div className="relative w-full">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-16 min-h-[36px] max-h-[120px] resize-none text-foreground focus-visible:ring-primary bg-background w-full text-sm rounded-lg"
          disabled={isThinking}
        />
        <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
          {onVoiceInput && (
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "ghost"}
              onClick={onVoiceInput}
              className="h-7 w-7 hover:bg-muted/80"
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
              "h-7 w-7 transition-transform bg-primary hover:bg-primary/90",
              value.trim() && !isThinking && "hover:scale-105"
            )}
            disabled={!value.trim() || isThinking}
          >
            {isThinking ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Send className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}