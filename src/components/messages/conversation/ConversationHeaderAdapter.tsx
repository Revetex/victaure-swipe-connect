
import { Receiver } from "@/types/messages";
import { ConversationHeader } from "./components/ConversationHeader";

interface ConversationHeaderAdapterProps {
  receiver: Receiver | null;
  onBack?: () => void;
}

export function ConversationHeaderAdapter({ receiver, onBack }: ConversationHeaderAdapterProps) {
  if (!receiver) return null;
  
  return (
    <ConversationHeader 
      name={receiver.full_name || ""} 
      avatar={receiver.avatar_url} 
      isOnline={Boolean(receiver.online_status)}
      receiver={receiver}
      onBack={onBack}
    />
  );
}
