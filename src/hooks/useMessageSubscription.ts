
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messages';
import { useMessagesStore } from '@/store/messagesStore';
import { UserProfile } from '@/types/profile';

export const useMessageSubscription = (profile: UserProfile | null) => {
  const { addMessage, updateMessage, deleteMessage } = useMessagesStore();

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
            
            const { error: updateError } = await supabase
              .from('messages')
              .update({ status: 'delivered' })
              .eq('id', newMessage.id);

            if (updateError) {
              console.error('Error updating message status:', updateError);
            }

            addMessage({
              ...newMessage,
              status: 'delivered'
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as Message;
            updateMessage(updatedMessage);
          } else if (payload.eventType === 'DELETE') {
            const deletedMessage = payload.old as Message;
            deleteMessage(deletedMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, addMessage, updateMessage, deleteMessage]);
};
