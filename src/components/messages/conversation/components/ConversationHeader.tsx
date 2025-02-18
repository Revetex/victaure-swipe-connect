
import { ChatHeader } from "@/components/chat/ChatHeader";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Receiver } from "@/types/messages";

interface ConversationHeaderProps {
  receiver: Receiver;
  onBack: () => void;
  onDelete: () => Promise<void>;
}

export function ConversationHeader({ receiver, onBack, onDelete }: ConversationHeaderProps) {
  return (
    <header className="flex-none">
      <ChatHeader
        title={receiver.full_name}
        subtitle={receiver.id === 'assistant' ? "Assistant virtuel" : receiver.online_status ? "En ligne" : "Hors ligne"}
        avatarUrl={receiver.avatar_url}
        onBack={onBack}
        onDelete={onDelete}
        isOnline={receiver.online_status}
        lastSeen={receiver.last_seen}
        actions={
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => {
              // Activation du chat vocal à implémenter
              console.log('Chat vocal activé');
            }}
          >
            <Phone className="h-4 w-4" />
          </Button>
        }
      />
    </header>
  );
}
