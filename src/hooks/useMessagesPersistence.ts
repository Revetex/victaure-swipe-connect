
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, transformDatabaseMessage, DatabaseMessage } from '@/types/messages';
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
        
        const formattedMessages = (data || []).map(msg => transformDatabaseMessage(msg as DatabaseMessage));
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
