import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "../../notifications/NotificationItem";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
      toast.error("Impossible de supprimer la notification");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-primary mb-4">
        <Bell className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              {...notification}
              onDelete={deleteNotification}
            />
          ))}
          {notifications.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucune notification</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}