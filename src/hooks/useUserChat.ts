
import { useState, useCallback, useEffect } from 'react';
import { Message, Receiver } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserChat {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  setInputMessage: (message: string) => void;
  handleSendMessage: (message: string, receiver: Receiver) => Promise<void>;
  clearChat: (receiverId: string) => Promise<void>;
}

export function useUserChat(): UserChat {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${profile.id}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            
            // Marquer automatiquement comme "delivered"
            const { error: updateError } = await supabase
              .from('messages')
              .update({ status: 'delivered' })
              .eq('id', newMessage.id);

            if (updateError) {
              console.error('Error updating message status:', updateError);
            }

            setMessages(prev => [...prev, {
              ...newMessage,
              status: 'delivered'
            }]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as Message;
            setMessages(prev => 
              prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedMessage = payload.old as Message;
            setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  // Surveiller l'état en ligne des utilisateurs
  useEffect(() => {
    if (!profile) return;

    const presenceChannel = supabase.channel('online_users');
    
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        console.log('Users online:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: profile.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [profile]);

  const handleSendMessage = useCallback(async (message: string, receiver: Receiver) => {
    if (!message.trim()) return;
    if (!profile) {
      toast.error("Vous devez être connecté pour envoyer des messages");
      return;
    }
    
    setIsLoading(true);
    try {
      const newMessage = {
        content: message,
        sender_id: profile.id,
        receiver_id: receiver.id,
        message_type: 'user',
        read: false,
        status: 'sent',
        metadata: {
          device: 'web',
          timestamp: new Date().toISOString()
        }
      };

      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert(newMessage)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .single();

      if (messageError) throw messageError;

      const notification = {
        user_id: receiver.id,
        title: "Nouveau message",
        message: `${profile.full_name} vous a envoyé : ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
        type: 'message'
      };

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notification);

      if (notificationError) {
        console.error('Erreur notification:', notificationError);
      }

      setInputMessage('');
      
      if (messageData) {
        const formattedMessage: Message = {
          ...messageData,
          timestamp: messageData.created_at,
          status: 'sent',
          message_type: 'user',
          metadata: messageData.metadata as Record<string, any> || {},
          sender: messageData.sender || {
            id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url || '/placeholder.svg',
            online_status: true,
            last_seen: new Date().toISOString()
          },
          receiver: messageData.receiver || receiver
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      }

    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const clearChat = useCallback(async (receiverId: string) => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (error) throw error;

      setMessages([]);
      toast.success("Conversation effacée");
    } catch (error) {
      console.error('Erreur effacement conversation:', error);
      toast.error("Erreur lors de l'effacement");
    }
  }, [profile]);

  return {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    handleSendMessage,
    clearChat
  };
}
