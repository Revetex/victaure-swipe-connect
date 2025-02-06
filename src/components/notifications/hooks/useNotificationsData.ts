
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';

interface NotificationGroups {
  [key: string]: Notification[];
}

export const useNotificationsData = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error("Erreur lors du chargement des notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== id));
      toast.success("Notification supprimée");
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success("Toutes les notifications ont été marquées comme lues");
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error("Une erreur est survenue");
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications([]);
      toast.success("Toutes les notifications ont été supprimées");
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast.error("Une erreur est survenue");
    }
  };

  return {
    notifications,
    isLoading,
    deleteNotification,
    markAllAsRead,
    deleteAllNotifications
  };
};
