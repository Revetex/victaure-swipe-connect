import { Bell, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

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

    // Subscribe to new notifications
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== id));
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès.",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la notification.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
          {notifications.filter(n => !n.read).length} nouvelles
        </span>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded relative group ${
                notification.read
                  ? "bg-muted"
                  : "bg-primary/10 border-l-2 border-primary"
              }`}
            >
              <button
                onClick={() => deleteNotification(notification.id)}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Supprimer la notification"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </button>
              <div className="flex justify-between items-start pr-6">
                <h3 className="font-medium">{notification.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatTime(notification.created_at)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}