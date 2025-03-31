
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Message, Sender } from '@/types/messages';
import { toast } from 'sonner';
import { generateRandomId } from '@/utils/conversationUtils';

export function useChatMessages(conversationId: string | null, receiverId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Charger les messages
  useEffect(() => {
    if (!conversationId || !user) {
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender:sender_id(*)')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        // Transformer les données pour s'assurer qu'elles correspondent à notre type Message
        const formattedMessages = data ? data.map(msg => {
          const senderData = msg.sender || {};
          const sender: Sender = {
            id: senderData.id || '',
            full_name: senderData.full_name || null,
            avatar_url: senderData.avatar_url || null,
            username: senderData.username || ''
          };
          
          return {
            id: msg.id,
            content: msg.content,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            created_at: msg.created_at,
            read: msg.read || false,
            sender
          } as Message;
        }) : [];
        
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Erreur lors du chargement des messages:', err);
        toast.error('Impossible de charger les messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Souscrire aux nouveaux messages
    const channel = supabase
      .channel(`conversation_${conversationId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          if (payload.new) {
            const newMsg = payload.new as any;
            const messageWithSender: Message = {
              ...newMsg,
              sender: {
                id: user.id,
                full_name: user.user_metadata?.full_name || null,
                avatar_url: user.user_metadata?.avatar_url || null,
                username: user.user_metadata?.username || ''
              }
            };
            setMessages((current) => [...current, messageWithSender]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  // Marquer les messages comme lus
  useEffect(() => {
    if (!conversationId || !user || !receiverId) return;

    const markAsRead = async () => {
      try {
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('conversation_id', conversationId)
          .eq('sender_id', receiverId)
          .eq('read', false);
      } catch (err) {
        console.error('Erreur lors du marquage des messages comme lus:', err);
      }
    };

    markAsRead();
  }, [conversationId, user, receiverId, messages]);

  // Envoyer un message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !receiverId || !conversationId || !content.trim()) {
        return false;
      }

      // Message optimiste pour UI
      const optimisticId = generateRandomId();
      const optimisticMessage: Message = {
        id: optimisticId,
        content,
        sender_id: user.id,
        receiver_id: receiverId,
        created_at: new Date().toISOString(),
        read: false,
        sender: {
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          username: user.user_metadata?.username || user.user_metadata?.full_name || ''
        }
      };

      setMessages((current) => [...current, optimisticMessage]);

      try {
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              conversation_id: conversationId,
              sender_id: user.id,
              receiver_id: receiverId,
              content: content.trim()
            }
          ])
          .select('*, sender:sender_id(*)')
          .single();

        if (error) throw error;

        // Mettre à jour le dernier message dans la conversation
        await supabase
          .from('conversations')
          .update({
            last_message: content.trim(),
            last_message_time: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);

        // Remplacer le message optimiste par le vrai message
        setMessages((current) =>
          current.map((msg) => (msg.id === optimisticId ? {
            ...data,
            sender: {
              id: user.id,
              full_name: user.user_metadata?.full_name || null, 
              avatar_url: user.user_metadata?.avatar_url || null,
              username: user.user_metadata?.username || ''
            }
          } : msg))
        );

        return true;
      } catch (err) {
        // En cas d'erreur, supprimer le message optimiste
        setMessages((current) => current.filter((msg) => msg.id !== optimisticId));
        console.error('Erreur lors de l\'envoi du message:', err);
        toast.error('Impossible d\'envoyer le message');
        return false;
      }
    },
    [user, receiverId, conversationId]
  );

  return {
    messages,
    isLoading,
    sendMessage
  };
}
