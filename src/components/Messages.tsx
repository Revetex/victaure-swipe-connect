import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessages } from "@/hooks/useMessages";
import { MessagesTab } from "./messages/tabs/MessagesTab";
import { NotificationsTab } from "./messages/tabs/NotificationsTab";
import { Settings } from "./Settings";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Bell, Settings2 } from "lucide-react";

export function Messages() {
  const { messages: userMessages } = useMessages();
  const [notifications, setNotifications] = useState<{ id: string; read: boolean }[]>([]);
  const unreadMessagesCount = userMessages.filter(m => !m.read).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('id, read')
        .eq('user_id', user.id);

      if (error) throw error;
      setNotifications(data || []);
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        fetchNotifications
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-4 h-full">
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="relative">
            <MessageSquare className="h-5 w-5" />
            {unreadMessagesCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10">
                {unreadMessagesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10">
                {unreadNotificationsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings2 className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <MessagesTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
}