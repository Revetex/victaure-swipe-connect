
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
        setLocalMessages(data || []);
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
            setLocalMessages(prev => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, receiverId]);

  const saveMessage = async (content: string, receiverId: string) => {
    if (!profile?.id) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content,
          sender_id: profile.id,
          receiver_id: receiverId,
          status: 'sent'
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      
      setLocalMessages(prev => [...prev, data]);
      return data;
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
