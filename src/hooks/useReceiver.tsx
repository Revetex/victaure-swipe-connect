
import { useState } from 'react';
import { Receiver } from '@/types/messages';

export function useReceiver() {
  const [receiver, setReceiver] = useState<Receiver | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return {
    receiver,
    showConversation,
    selectedConversationId,
    setReceiver,
    setShowConversation,
    setSelectedConversationId
  };
}
