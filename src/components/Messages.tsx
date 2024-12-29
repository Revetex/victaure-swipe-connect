import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesTab } from "@/components/messages/tabs/MessagesTab";
import { NotificationsTab } from "@/components/messages/tabs/NotificationsTab";
import { AssistantTab } from "@/components/messages/tabs/AssistantTab";
import { useMessages } from "@/hooks/useMessages";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Bell, Settings2 } from "lucide-react";

export function Messages() {
  const { messages } = useMessages();
  const [notifications, setNotifications] = useState<{ id: string; read: boolean }[]>([]);
  const unreadMessagesCount = messages.filter(m => !m.read).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('notifications')
        .select('id, read')
        .eq('user_id', user.id);

      setNotifications(data || []);
    };

    fetchNotifications();

    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications' },
        fetchNotifications
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Tabs defaultValue="messages" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="messages" className="relative">
          <MessageSquare className="h-5 w-5" />
          <span className="ml-2">Messages</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="notifications" className="relative">
          <Bell className="h-5 w-5" />
          <span className="ml-2">Notifications</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="assistant">
          <Settings2 className="h-5 w-5" />
          <span className="ml-2">Assistant</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="messages">
        <MessagesTab />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationsTab notifications={notifications} />
      </TabsContent>
      <TabsContent value="assistant">
        <AssistantTab />
      </TabsContent>
    </Tabs>
  );
}