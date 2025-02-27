
import { useState } from 'react';

export interface Receiver {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email?: string | null;
  online_status?: 'online' | 'offline';
  last_seen?: string | null;
  latitude?: number;
  longitude?: number;
}

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
