import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export function useMessagesPersistence(receiverId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!profile?.id || !receiverId) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(*),
            receiver:profiles!messages_receiver_id_fkey(*)
          `)
          .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${profile.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        const formattedMessages: Message[] = (data || []).map(msg => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          created_at: msg.created_at,
          updated_at: msg.updated_at || msg.created_at,
          read: msg.read || false,
          sender: msg.sender || {
            id: msg.sender_id,
            full_name: 'Unknown User',
            avatar_url: '',
            online_status: false,
            last_seen: new Date().toISOString()
          },
          receiver: msg.receiver,
          timestamp: msg.created_at,
          thinking: false,
          message_type: msg.is_assistant ? 'assistant' : 'user',
          status: (msg.status as "sent" | "delivered" | "read") || 'sent',
          metadata: typeof msg.metadata === 'object' ? msg.metadata as Record<string, any> : {}
        }));

        setLocalMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error("Erreur lors du chargement des messages");
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${receiverId},receiver_id=eq.${profile.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as any;
            const formattedMessage: Message = {
              id: newMessage.id,
              content: newMessage.content,
              sender_id: newMessage.sender_id,
              receiver_id: newMessage.receiver_id,
              created_at: newMessage.created_at,
              updated_at: newMessage.updated_at || newMessage.created_at,
              read: newMessage.read || false,
              sender: newMessage.sender || {
                id: newMessage.sender_id,
                full_name: 'Unknown User',
                avatar_url: '',
                online_status: false,
                last_seen: new Date().toISOString()
              },
              receiver: newMessage.receiver,
              timestamp: newMessage.created_at,
              thinking: false,
              message_type: newMessage.is_assistant ? 'assistant' : 'user',
              status: 'sent' as const,
              metadata: typeof newMessage.metadata === 'object' ? newMessage.metadata as Record<string, any> : {}
            };
            setLocalMessages(prev => [...prev, formattedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, receiverId]);

  const formatMessage = (msg: any): Message => ({
    id: msg.id,
    content: msg.content,
    sender_id: msg.sender_id,
    receiver_id: msg.receiver_id,
    created_at: msg.created_at,
    updated_at: msg.updated_at || msg.created_at,
    read: msg.read || false,
    sender: msg.sender || {
      id: msg.sender_id,
      full_name: 'Unknown User',
      avatar_url: '',
      online_status: false,
      last_seen: new Date().toISOString()
    },
    receiver: msg.receiver,
    timestamp: msg.created_at,
    thinking: false,
    message_type: msg.is_assistant ? 'assistant' : 'user',
    status: msg.status || 'sent',
    metadata: typeof msg.metadata === 'object' ? msg.metadata : {}
  });

  const saveMessage = async (content: string, receiverId: string) => {
    if (!profile?.id) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: profile.id,
          receiver_id: receiverId,
          status: 'sent',
          message_type: receiverId === 'assistant' ? 'assistant' : 'user'
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      
      return formatMessage(data);
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error("Erreur lors de l'envoi du message");
      return null;
    }
  };

  return {
    messages: localMessages,
    isLoading,
    saveMessage
  };
}
