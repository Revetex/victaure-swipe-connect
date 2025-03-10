
import { Receiver } from "@/types/messages";
import { ConversationHeader } from "../ConversationHeader";

interface ConversationHeaderAdapterProps {
  receiver: Receiver;
  onBack?: () => void;
}

export function ConversationHeaderAdapter({ receiver, onBack }: ConversationHeaderAdapterProps) {
  if (!receiver) return null;
  
  // Ensure we have a boolean value for isOnline
  const isOnline = typeof receiver.online_status === 'string'
    ? receiver.online_status === 'true' || receiver.online_status === 'online'
    : Boolean(receiver.online_status);
  
  // Convert the Receiver type to the props expected by ConversationHeader
  const headerProps = {
    name: receiver.full_name || receiver.username || "Unknown",
    avatar: receiver.avatar_url || "",
    isOnline,
    partner: receiver,
    receiver,
    onBack,
    onClose: onBack
  };
  
  return (
    <ConversationHeader 
      {...headerProps}
    />
  );
}
