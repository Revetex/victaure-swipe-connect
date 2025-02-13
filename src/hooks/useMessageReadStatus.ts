
import { useEffect } from 'react';
import { useMarkAsRead } from './messages/useMarkAsRead';
import { Receiver } from '@/types/messages';

export function useMessageReadStatus(isVisible: boolean, receiver: Receiver | null) {
  const markAsRead = useMarkAsRead(receiver?.id);

  useEffect(() => {
    if (isVisible && receiver) {
      markAsRead.mutate();
    }
  }, [isVisible, receiver, markAsRead]);
}
