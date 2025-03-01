
import React from 'react';
import { Receiver, ConversationHeaderProps } from '@/types/messages';
import { ConversationHeader } from './ConversationHeader';

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
    onBack
  };
  
  return <ConversationHeader {...headerProps} />;
}
