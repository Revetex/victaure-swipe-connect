
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, Sender } from '@/types/messages';
import { toast } from 'sonner';

type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username?: string;
  email?: string;
};

export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, username, email)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Format messages and add sender info
      const formattedMessages = data.map(msg => {
        // Ensure we have proper typing for the sender profile
        const senderProfile = msg.sender as UserProfile;
        
        const message: Message = {
          ...msg,
          sender: senderProfile ? {
            id: senderProfile.id,
            full_name: senderProfile.full_name,
            avatar_url: senderProfile.avatar_url,
            username: senderProfile.username,
            email: senderProfile.email
          } : null
        };
        return message;
      });

      setMessages(formattedMessages.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Fetch the sender info for the new message
          const { data: senderData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, username, email')
            .eq('id', payload.new.sender_id)
            .single();
          
          const newMsg: Message = {
            ...payload.new,
            sender: senderData as Sender
          };

          setMessages(prev => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  // Send message function
  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId || !content.trim()) return null;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const newMsg = {
        conversation_id: conversationId,
        content,
        sender_id: user.id,
        receiver_id: '', // This will be filled based on the conversation
        created_at: new Date().toISOString(),
        read: false
      };
      
      // First get the conversation to determine the receiver
      const { data: convoData, error: convoError } = await supabase
        .from('conversations')
        .select('participant1_id, participant2_id')
        .eq('id', conversationId)
        .single();
        
      if (convoError) throw convoError;
      
      // Determine the receiver based on the conversation participants
      const receiverId = convoData.participant1_id === user.id 
        ? convoData.participant2_id 
        : convoData.participant1_id;
      
      // Update the receiver_id
      newMsg.receiver_id = receiverId;
      
      // Insert the message
      const { data, error } = await supabase
        .from('messages')
        .insert(newMsg)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update the last_message and last_message_time in the conversation
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
      
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      return null;
    }
  }, [conversationId]);

  return {
    messages,
    isLoading,
    newMessage,
    setNewMessage,
    sendMessage,
    fetchMessages
  };
}
