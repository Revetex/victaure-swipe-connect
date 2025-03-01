
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
      receiver={receiver}
      onBack={onBack}
    />
  );
}
