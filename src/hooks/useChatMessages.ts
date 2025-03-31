
import { useState, useCallback, useEffect } from 'react';
import { Message, Sender } from '@/types/messages';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from '@/types/profile';

export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          updated_at,
          read,
          message_type,
          reaction,
          is_deleted,
          conversation_id,
          status,
          metadata,
          sender:sender_id(id, full_name, avatar_url, username, email)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at');

      if (error) throw error;

      // Ensure each message has a valid sender property
      const messagesWithSenders = data.map(msg => {
        // Si le sender est null ou undefined, créez un sender par défaut
        if (!msg.sender) {
          const defaultSender: Sender = {
            id: msg.sender_id || '',
            full_name: 'Utilisateur inconnu',
            avatar_url: null,
          };
          return { ...msg, sender: defaultSender };
        }
        
        // Si le sender n'est pas du bon type (par exemple une erreur de requête)
        // assurez-vous que l'objet a les propriétés requises
        const senderData = msg.sender as unknown;
        if (typeof senderData === 'object' && senderData !== null) {
          const sender: Sender = {
            id: (senderData as any).id || msg.sender_id || '',
            full_name: (senderData as any).full_name || 'Utilisateur inconnu',
            avatar_url: (senderData as any).avatar_url || null,
            username: (senderData as any).username,
            email: (senderData as any).email
          };
          return { ...msg, sender };
        }
        
        // En dernier recours, utilisez le sender_id pour créer un sender basique
        return { 
          ...msg, 
          sender: {
            id: msg.sender_id || '',
            full_name: 'Utilisateur inconnu',
            avatar_url: null
          } 
        };
      });

      setMessages(messagesWithSenders);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !user?.id || !content.trim()) return null;
    
    try {
      const newMessage = {
        id: uuidv4(),
        content,
        sender_id: user.id,
        receiver_id: '', // This will be set by the database trigger
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
        read: false
      };

      const { error } = await supabase
        .from('messages')
        .insert(newMessage);

      if (error) throw error;
      
      return newMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return null;
    }
  }, [conversationId, user]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      
      // Subscribe to new messages
      const subscription = supabase
        .channel(`messages:${conversationId}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          // Make sure we have all required properties for the message
          const newMessage: Message = {
            id: payload.new.id,
            content: payload.new.content,
            sender_id: payload.new.sender_id,
            receiver_id: payload.new.receiver_id,
            created_at: payload.new.created_at,
            conversation_id: payload.new.conversation_id,
            // Add any other properties from the payload
            ...(payload.new as any),
            // Add a default sender if needed
            sender: {
              id: payload.new.sender_id,
              full_name: null,
              avatar_url: null
            }
          };
          
          setMessages(prev => [...prev, newMessage]);
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [conversationId, fetchMessages]);

  // Mark messages as read
  useEffect(() => {
    if (!conversationId || !user?.id || messages.length === 0) return;
    
    const unreadMessages = messages
      .filter(m => !m.read && m.sender_id !== user.id)
      .map(m => m.id);
    
    if (unreadMessages.length > 0) {
      supabase
        .from('messages')
        .update({ read: true })
        .in('id', unreadMessages)
        .then(({ error }) => {
          if (error) console.error('Error marking messages as read:', error);
        });
    }
  }, [messages, conversationId, user]);

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage,
    refresh: fetchMessages 
  };
}
