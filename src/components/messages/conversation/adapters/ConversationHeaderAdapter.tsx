
import { Receiver } from "@/types/messages";
import { ConversationHeader } from "../ConversationHeader";

interface ConversationHeaderAdapterProps {
  receiver: Receiver;
  onBack?: () => void;
}

export function ConversationHeaderAdapter({ receiver, onBack }: ConversationHeaderAdapterProps) {
  if (!receiver) return null;
  
  // Convert the Receiver type to the props expected by ConversationHeader
  const headerProps = {
    name: receiver.full_name || receiver.username || "Unknown",
    avatar: receiver.avatar_url || "",
    isOnline: receiver.online_status || false,
    partner: receiver,
    onBack,
    onClose: onBack
  };
  
  return (
    <ConversationHeader 
      {...headerProps}
    />
  );
}
