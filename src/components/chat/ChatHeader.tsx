import { Bot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ChatHeaderProps {
  isThinking: boolean;
  onClearChat: () => void;
}

export function ChatHeader({ isThinking, onClearChat }: ChatHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <div>
          <h2 className="font-semibold">{t("mrVictaure.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("mrVictaure.subtitle")}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClearChat}
        disabled={isThinking}
        className="text-muted-foreground hover:text-primary"
        title={t("chat.clearChat")}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}