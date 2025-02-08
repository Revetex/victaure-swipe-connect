
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  user_id: string;
  created_at: string;
  updated_at: string;
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
      setMessages(data as ChatMessage[]);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    return supabase
      .channel('ai_chat_messages')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'ai_chat_messages' },
        loadMessages
      )
      .subscribe();
  };

  useEffect(() => {
    loadMessages();
    const channel = subscribeToMessages();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const addMessage = async (content: string, sender: 'user' | 'assistant') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser le chat");
        return null;
      }

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        sender,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data as ChatMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
      return null;
    }
  };

  return { messages, isLoading, addMessage, setMessages };
}

