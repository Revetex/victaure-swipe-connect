
import { Receiver } from "@/types/messages";
import { ConversationHeader } from "./components/ConversationHeader";

interface ConversationHeaderAdapterProps {
  receiver: Receiver;
  onBack?: () => void;
}

/**
 * Adaptateur pour ConversationHeader qui transforme les propriétés
 * pour les rendre compatibles avec l'interface ConversationHeaderProps
 */
export function ConversationHeaderAdapter({ 
  receiver, 
  onBack 
}: ConversationHeaderAdapterProps) {
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
