import { MessageSquare, Bell, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MessageList } from "./messages/MessageList";
import { useMessages } from "@/hooks/useMessages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationItem } from "./notifications/NotificationItem";
import { toast } from "sonner";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessage } from "./chat/ChatMessage";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export function Messages() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadMessagesCount = userMessages.filter(m => !m.read).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
  } = useChat();

  const { profile } = useProfile();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [chatMessages]);

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
    <div className="space-y-4 h-full">
      <Tabs defaultValue="assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assistant" className="relative">
            Assistant
          </TabsTrigger>
          <TabsTrigger value="messages" className="relative">
            Messages
            {unreadMessagesCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10">
                {unreadMessagesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadNotificationsCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10">
                {unreadNotificationsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="h-[500px] flex flex-col">
          <div className="flex items-center p-4 relative border-b border-victaure-blue/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`h-12 w-12 rounded-full bg-victaure-blue/20 flex items-center justify-center transition-all duration-300 ${isThinking ? 'bg-victaure-blue/30' : 'hover:bg-victaure-blue/30'}`}>
                  <Bot className={`h-6 w-6 text-victaure-blue ${isThinking ? 'animate-pulse' : ''}`} />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Mr. Victaure</h2>
                <p className="text-sm text-muted-foreground">
                  {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
                </p>
              </div>
            </div>
          </div>

          <div 
            ref={scrollAreaRef}
            className="flex-grow overflow-y-auto mb-4 px-4 scrollbar-thin scrollbar-thumb-victaure-blue/20 scrollbar-track-transparent"
          >
            <div className="space-y-4 py-4">
              {chatMessages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                  thinking={message.thinking}
                  showTimestamp={
                    index === 0 || 
                    chatMessages[index - 1]?.sender !== message.sender ||
                    new Date(message.timestamp).getTime() - new Date(chatMessages[index - 1]?.timestamp).getTime() > 300000
                  }
                  timestamp={message.timestamp}
                />
              ))}
            </div>
          </div>

          <div className="p-4 pt-0">
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={() => handleSendMessage(inputMessage, profile)}
              onVoiceInput={handleVoiceInput}
              isListening={isListening}
              isThinking={isThinking}
            />
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="flex items-center gap-2 text-primary mb-4">
            <MessageSquare className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          <MessageList
            messages={userMessages}
            isLoading={isLoading}
            onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
          />
        </TabsContent>

        <TabsContent value="notifications">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}