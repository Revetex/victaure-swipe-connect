import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChatActions } from "./ChatActions";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && !isThinking && onSend()}
        placeholder={t("chat.typeMessage")}
        className="flex-grow pr-20"
        disabled={isThinking}
      />
      <ChatActions
        onSend={onSend}
        onVoiceInput={onVoiceInput}
        isListening={isListening}
        isThinking={isThinking}
      />
    </div>
  );
}