
import { useState, useCallback } from 'react';
import { Message, Receiver, MessageSender } from '@/types/messages';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useMessagesStore } from '@/store/messagesStore';
import { useMessageSubscription } from './useMessageSubscription';
import { usePresenceTracking } from './usePresenceTracking';

interface UserChat {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  setInputMessage: (message: string) => void;
  handleSendMessage: (message: string, receiver: Receiver) => Promise<void>;
  clearChat: (receiverId: string) => Promise<void>;
}

export function useUserChat(): UserChat {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { messages, setMessages, addMessage } = useMessagesStore();

  useMessageSubscription(profile);
  usePresenceTracking(profile);

  const handleSendMessage = useCallback(async (message: string, receiver: Receiver) => {
    if (!message.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }
    
    if (!profile) {
      toast.error("Vous devez être connecté pour envoyer des messages");
      return;
    }
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const messageType = receiver.id === 'assistant' ? 'ai' as const : 'user' as const;
      
      const newMessage = {
        content: message,
        sender_id: user.id,
        receiver_id: receiver.id === 'assistant' ? user.id : receiver.id,
        message_type: messageType,
        read: false,
        status: 'sent' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          timestamp: new Date().toISOString(),
          messageType: messageType
        }
      };

      const { data: savedMessage, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `)
        .single();

      if (error) {
        console.error('Error saving message:', error);
        throw error;
      }

      if (savedMessage) {
        const sender: MessageSender = {
          id: profile.id,
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url || '',
          online_status: true,
          last_seen: new Date().toISOString()
        };

        addMessage({
          ...savedMessage,
          timestamp: savedMessage.created_at,
          status: 'sent',
          message_type: messageType,
          metadata: {
            timestamp: savedMessage.created_at,
            messageType: messageType
          },
          sender
        });
        setInputMessage('');
      }

      if (receiver.id === 'assistant') {
        const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-chat', {
          body: { 
            message,
            userId: user.id,
            context: {
              previousMessages: messages.slice(-5),
              userProfile: profile,
            }
          }
        });

        if (aiError) throw aiError;

        const aiMessage = {
          content: aiResponse.response,
          sender_id: user.id,
          receiver_id: user.id,
          message_type: 'ai' as const,
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {} as Record<string, any>
        };

        const { data: savedAiMessage, error: aiSaveError } = await supabase
          .from('messages')
          .insert(aiMessage)
          .select('*')
          .single();

        if (aiSaveError) throw aiSaveError;

        if (savedAiMessage) {
          const aiSender: MessageSender = {
            id: 'assistant',
            full_name: 'M. Victaure',
            avatar_url: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
            online_status: true,
            last_seen: new Date().toISOString()
          };

          addMessage({
            ...savedAiMessage,
            timestamp: savedAiMessage.created_at,
            status: 'sent',
            message_type: 'ai',
            metadata: savedAiMessage.metadata || {},
            sender: aiSender
          });
        }
      }

    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  }, [profile, messages, addMessage]);

  const clearChat = useCallback(async (receiverId: string) => {
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${profile.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${profile.id})`);

      if (error) throw error;

      setMessages([]);
      toast.success("Conversation effacée");
    } catch (error) {
      console.error('Erreur effacement conversation:', error);
      toast.error("Erreur lors de l'effacement");
    }
  }, [profile, setMessages]);

  return {
    messages,
    inputMessage,
    isLoading,
    setInputMessage,
    handleSendMessage,
    clearChat
  };
}
