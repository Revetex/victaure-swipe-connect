import { MessageSquare, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MessageList } from "./messages/MessageList";
import { useMessages } from "@/hooks/useMessages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "./notifications/NotificationItem";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export function Messages() {
  const { t } = useTranslation();
  const { messages, isLoading, markAsRead } = useMessages();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadMessagesCount = messages.filter(m => !m.read).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
      toast.success(t("notifications.deleteNotification"));
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(t("error.deleteNotification"));
    }
  };

  return (
    <div className="space-y-4 h-full">
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="relative">
            {t("messages.title")}
            {unreadMessagesCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10">
                {unreadMessagesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            {t("notifications.title")}
            {unreadNotificationsCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10">
                {unreadNotificationsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="flex items-center gap-2 text-primary mb-4">
            <MessageSquare className="h-5 w-5" />
            <h2 className="text-lg font-semibold">{t("messages.title")}</h2>
          </div>
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Bell className="h-5 w-5" />
            <h2 className="text-lg font-semibold">{t("notifications.title")}</h2>
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
                  <p>{t("notifications.noNotifications")}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}