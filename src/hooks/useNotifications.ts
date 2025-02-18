
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './useUser';
import { toast } from 'sonner';

export function useNotifications() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(payload.new.title, {
                  body: payload.new.message,
                  icon: '/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png',
                  data: {
                    url: window.location.origin + '/notifications'
                  }
                });
              } catch (error) {
                console.error('Error showing notification:', error);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Erreur lors de la mise à jour des notifications');
    }
  };

  const getUnreadCount = async () => {
    if (!user) return 0;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return data.length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  };

  return { markAllAsRead, getUnreadCount };
}
