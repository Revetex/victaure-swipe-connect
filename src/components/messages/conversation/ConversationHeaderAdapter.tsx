
import React from 'react';
import { ConversationHeaderProps, Receiver } from '@/types/messages';

interface ConversationHeaderAdapterProps {
  receiver?: Receiver;
  onBack?: () => void;
  onClose?: () => void;
}

export function ConversationHeaderAdapter({ 
  receiver, 
  onBack,
  onClose
}: ConversationHeaderAdapterProps) {
  if (!receiver) {
    return null;
  }

  // Create adapter props that match the ConversationHeaderProps interface
  const headerProps: ConversationHeaderProps = {
    name: receiver.full_name || 'Unknown',
    avatar: receiver.avatar_url,
    isOnline: receiver.online_status || false,
    receiver,
    onBack,
    onClose,
    partner: receiver // For backward compatibility
  };

  return headerProps;
}
