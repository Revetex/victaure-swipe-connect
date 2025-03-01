
import { Receiver } from "@/types/messages";
import { ConversationHeader } from "../ConversationHeader";

interface ConversationHeaderAdapterProps {
  receiver: Receiver;
  onBack?: () => void;
}

export function ConversationHeaderAdapter({ receiver, onBack }: ConversationHeaderAdapterProps) {
  if (!receiver) return null;
  
  return (
    <ConversationHeader 
      name={receiver.full_name || ''}
      avatar={receiver.avatar_url}
      isOnline={!!receiver.online_status}
      receiver={receiver}
      onBack={onBack}
    />
  );
}
