
import { ChatHeader } from "@/components/chat/ChatHeader";
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
      />
    </header>
  );
}
