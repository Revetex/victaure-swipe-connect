import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessages } from "@/hooks/useMessages";
import { MessagesTab } from "./messages/tabs/MessagesTab";
import { NotificationsTab } from "./messages/tabs/NotificationsTab";
import { Settings } from "./Settings";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Bell, Settings2 } from "lucide-react";

interface Notification {
  id: string;
  read: boolean;
}

export function Messages() {
  const { messages: userMessages } = useMessages();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadMessagesCount = userMessages.filter(m => !m.read).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
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

  // Mark notifications as read when notifications tab is opened
  useEffect(() => {
    const markNotificationsAsRead = async () => {
      if (activeTab === "notifications" && unreadNotificationsCount > 0) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);

          if (error) throw error;

          // Update local state
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      }
    };

    markNotificationsAsRead();
  }, [activeTab, unreadNotificationsCount]);

  return (
    <div className="h-full flex flex-col">
      <Tabs 
        defaultValue="messages" 
        className="flex-1 flex flex-col"
        onValueChange={setActiveTab}
      >
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

        <div className="flex-1 overflow-hidden">
          <TabsContent value="messages" className="h-full">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="notifications" className="h-full">
            <NotificationsTab />
          </TabsContent>

          <TabsContent value="settings" className="h-full">
            <Settings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}