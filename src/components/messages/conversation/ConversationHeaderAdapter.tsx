
import React from 'react';
import { Receiver } from '@/types/messages';

interface ConversationHeaderProps {
  name: string;
  avatar: string | null;
  isOnline: boolean;
  partner?: any;
  receiver?: Receiver;
  onBack?: () => void;
  onClose?: () => void;
}

interface ReceiverHeaderProps {
  receiver: Receiver | null;
  onBack?: () => void;
}

export function ConversationHeaderAdapter({ receiver, onBack }: ReceiverHeaderProps) {
  if (!receiver) return null;
  
  const headerProps: ConversationHeaderProps = {
    name: receiver.full_name || 'User',
    avatar: receiver.avatar_url,
    isOnline: !!receiver.online_status,
    receiver: receiver,
    partner: receiver, // Add partner prop
    onBack,
    onClose: onBack // Map onBack to onClose as well for compatibility
  };
  
  return <ConversationHeader {...headerProps} />;
}

// This is a placeholder component that will be replaced by an import
// in the actual implementation
function ConversationHeader(props: ConversationHeaderProps) {
  // This is just a placeholder and will be replaced by imports
  return null;
}
