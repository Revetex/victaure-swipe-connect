
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
            avatar_url: null,
            online_status: false,
            last_seen: new Date().toISOString()
          },
          receiver: msg.receiver || {
            id: msg.receiver_id,
            full_name: 'Unknown User',
            avatar_url: null,
            online_status: false,
            last_seen: new Date().toISOString()
          },
          timestamp: msg.created_at,
          thinking: false,
          message_type: msg.is_assistant ? 'assistant' : 'user',
          status: (msg.status as 'sent' | 'delivered' | 'read') || 'sent',
          metadata: msg.metadata || {},
          reaction: msg.reaction || null,
          is_assistant: msg.is_assistant || false
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
  }, [profile?.id, receiverId]);

  return {
    messages: localMessages,
    isLoading
  };
}
