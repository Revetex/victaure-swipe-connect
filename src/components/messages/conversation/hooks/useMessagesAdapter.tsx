
import { useState, useEffect } from 'react';
import { Message, Receiver } from '@/types/messages';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

/**
 * Crée un objet Message complet à partir d'un objet partiel
 */
export function createFullMessage(partialMessage: any): Message {
  return {
    id: partialMessage.id || `temp-${Date.now()}`,
    content: partialMessage.content || '',
    sender_id: partialMessage.sender_id || (partialMessage.sender?.id || ''),
    receiver_id: partialMessage.receiver_id || '',
    created_at: partialMessage.created_at || new Date().toISOString(),
    read: Boolean(partialMessage.read),
    status: partialMessage.status || 'sent',
    reaction: partialMessage.reaction,
    deleted: Boolean(partialMessage.deleted),
    message_type: partialMessage.message_type || 'text',
    metadata: partialMessage.metadata || {},
    sender: partialMessage.sender
  };
}

/**
 * Version adaptée de useMessages qui gère correctement les types
 */
export function useMessagesAdapter(receiver: Receiver | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fonction sécurisée pour ajouter un message
  const addMessage = (messageData: any) => {
    setMessages(prev => [...prev, createFullMessage(messageData)]);
  };

  useEffect(() => {
    if (!receiver?.id || !user?.id) return;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender:profiles(*)')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        // Transformer les données pour s'assurer qu'elles sont du bon type
        const adaptedMessages = (data || []).map(createFullMessage);
        setMessages(adaptedMessages);
        
        // Marquer les messages comme lus
        const unreadMessages = data
          ?.filter(msg => msg.sender_id === receiver.id && msg.read === false)
          .map(msg => msg.id) || [];
          
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setError(err as Error);
        toast.error("Impossible de charger les messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Écouter les nouveaux messages en temps réel
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(and(receiver_id.eq.${user.id},sender_id.eq.${receiver.id}),and(receiver_id.eq.${receiver.id},sender_id.eq.${user.id}))`
        },
        async (payload) => {
          console.log("Real-time message update:", payload);
          
          if (payload.eventType === 'INSERT') {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', payload.new.sender_id)
              .single();

            // Créer un message complet
            const newMessage = createFullMessage({
              ...payload.new,
              sender: senderProfile
            });

            // Marquer automatiquement comme lu si c'est un message entrant
            if (payload.new.sender_id === receiver.id) {
              await supabase
                .from('messages')
                .update({ read: true })
                .eq('id', payload.new.id);
            }

            setMessages(prev => [...prev, newMessage]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id 
                  ? createFullMessage({ ...msg, ...payload.new })
                  : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [receiver?.id, user?.id]);

  // Fonction sécurisée pour supprimer un message
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user?.id);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success("Message supprimé");
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Impossible de supprimer le message");
    }
  };

  // Fonction sécurisée pour définir des messages
  const safeSetMessages = (newMessages: any[]) => {
    // S'assurer que tous les messages ont le bon format
    const validMessages = newMessages.map(createFullMessage);
    setMessages(validMessages);
  };

  return { 
    messages, 
    isLoading, 
    error, 
    handleDeleteMessage, 
    setMessages: safeSetMessages,
    addMessage
  };
}
