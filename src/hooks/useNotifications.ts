import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("messages");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('id, read')
          .eq('user_id', user.id);

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
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

  useEffect(() => {
    const markNotificationsAsRead = async () => {
      if (activeTab === "notifications" && notifications.filter(n => !n.read).length > 0) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);

          if (error) throw error;

          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      }
    };

    markNotificationsAsRead();
  }, [activeTab, notifications]);

  return {
    notifications,
    activeTab,
    setActiveTab,
    unreadNotificationsCount: notifications.filter(n => !n.read).length
  };
}