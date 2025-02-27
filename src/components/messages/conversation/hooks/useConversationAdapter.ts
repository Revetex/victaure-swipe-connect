
import { useState, useEffect } from 'react';
import { Conversation, Message, Receiver } from '@/types/messages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useConversationAdapter(receiver?: Receiver) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction utilitaire pour s'assurer que les valeurs booléennes sont correctes
  const ensureBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return !!value;
  };

  // Fonction utilitaire pour créer un message complet
  const createFullMessage = (data: any): Message => ({
    id: data.id || `temp-${Date.now()}`,
    content: data.content || '',
    sender_id: data.sender_id,
    receiver_id: data.receiver_id,
    created_at: data.created_at || new Date().toISOString(),
    read: ensureBoolean(data.read),
    status: data.status || 'sent',
    reaction: data.reaction,
    message_type: data.message_type || 'text',
    metadata: data.metadata || {},
    sender: data.sender
  });

  // Fonction utilitaire pour créer des props d'en-tête valides
  const createHeaderProps = (rcv: Receiver) => ({
    name: rcv.full_name || 'Contact',
    avatar: rcv.avatar_url,
    isOnline: ensureBoolean(rcv.online_status),
    receiver: rcv,
    onBack: () => window.history.back()
  });

  const addMessage = (messageData: Partial<Message>) => {
    const fullMessage = createFullMessage(messageData);
    setMessages(prev => [...prev, fullMessage]);
  };

  return {
    conversation,
    messages,
    loading,
    addMessage,
    createHeaderProps,
    ensureBoolean
  };
}
