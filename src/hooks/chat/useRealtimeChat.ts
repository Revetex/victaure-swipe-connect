
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  user_id: string;
  created_at: string;
}

export function useRealtimeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const typedMessages: ChatMessage[] = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'assistant',
        user_id: msg.user_id,
        created_at: msg.created_at
      }));

      setMessages(typedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('ai_chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_chat_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          loadMessages();
        }
      )
      .subscribe();

    return channel;
  };

  useEffect(() => {
    loadMessages();
    const channel = subscribeToMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addMessage = async (content: string, sender: 'user' | 'assistant') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser le chat");
        return null;
      }

      const message = {
        content,
        sender,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
      return null;
    }
  };

  return {
    messages,
    isLoading,
    addMessage,
    setMessages
  };
}
