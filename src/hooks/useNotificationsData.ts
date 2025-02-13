
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { showToast, commonToasts } from "@/utils/toast";

export function useNotificationsData() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      commonToasts.errorOccurred();
      return;
    }

    setNotifications(data || []);
    setUnreadCount(data?.filter(n => !n.read).length || 0);
  };

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        fetchNotifications
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== id));
      showToast.success("Notification supprimée");
    } catch (error) {
      commonToasts.actionFailed("de la suppression");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      showToast.success("Toutes les notifications ont été marquées comme lues");
    } catch (error) {
      commonToasts.errorOccurred();
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const unsubscribe = subscribeToNotifications();
    return () => {
      unsubscribe();
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    deleteNotification,
    handleMarkAllAsRead
  };
}
