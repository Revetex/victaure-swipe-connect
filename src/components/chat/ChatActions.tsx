import { Button } from "@/components/ui/button";
import { Send, Mic } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ChatActionsProps {
  onSend: () => void;
  onVoiceInput: () => void;
  isListening: boolean;
  isThinking: boolean;
}

export function ChatActions({ 
  onSend, 
  onVoiceInput, 
  isListening, 
  isThinking 
}: ChatActionsProps) {
  const { t } = useTranslation();

  return (
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
        title={isListening ? t("chat.stopVoice") : t("chat.startVoice")}
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
        title={t("chat.sendMessage")}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}