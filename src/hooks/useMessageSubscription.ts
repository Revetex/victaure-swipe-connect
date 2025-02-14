
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messages';

interface MessageSubscriptionProps {
  onMessage?: (message: Message) => void;
}

export function useMessageSubscription({ onMessage }: MessageSubscriptionProps = {}) {
  useEffect(() => {
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            if (onMessage) {
              onMessage(newMessage);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onMessage]);
}
