
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/useUser";
import { PageLayout } from "@/components/layout/PageLayout";
import type { Message, MessageSender } from "@/types/messages";

// Define the database message type
interface DatabaseMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string | null;
  read: boolean;
  is_assistant: boolean;
  status?: 'sent' | 'delivered' | 'read';
  metadata?: Record<string, any>;
  reaction?: string;
  sender?: MessageSender;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey (
              id,
              full_name,
              avatar_url,
              online_status,
              last_seen
            )
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }

        if (data) {
          const transformedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            created_at: msg.created_at,
            updated_at: msg.updated_at || msg.created_at,
            read: msg.read ?? false,
            sender: {
              id: msg.sender.id,
              full_name: msg.sender.full_name || "Unknown",
              avatar_url: msg.sender.avatar_url || "",
              online_status: msg.sender.online_status || false,
              last_seen: msg.sender.last_seen || new Date().toISOString()
            },
            timestamp: msg.created_at,
            message_type: msg.is_assistant ? 'assistant' : 'user',
            status: (msg.status as 'sent' | 'delivered' | 'read') || 'sent',
            metadata: (typeof msg.metadata === 'object' && msg.metadata !== null) ? msg.metadata as Record<string, any> : {},
            is_assistant: msg.is_assistant || false,
            thinking: false,
            reaction: msg.reaction
          }));
          setMessages(transformedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const messagesSubscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new) {
            setMessages((prevMessages) => {
              const newMsg = payload.new as DatabaseMessage;
              
              // Vérifier si le message existe déjà
              const messageExists = prevMessages.some(msg => msg.id === newMsg.id);
              if (messageExists) {
                return prevMessages;
              }

              // Transformer le nouveau message
              const transformedMessage: Message = {
                id: newMsg.id,
                content: newMsg.content,
                sender_id: newMsg.sender_id,
                receiver_id: newMsg.receiver_id,
                created_at: newMsg.created_at,
                updated_at: newMsg.updated_at || newMsg.created_at,
                read: newMsg.read ?? false,
                sender: newMsg.sender || {
                  id: newMsg.sender_id,
                  full_name: "Unknown",
                  avatar_url: "",
                  online_status: false,
                  last_seen: new Date().toISOString()
                },
                timestamp: newMsg.created_at,
                message_type: newMsg.is_assistant ? 'assistant' : 'user',
                status: newMsg.status || 'sent',
                metadata: newMsg.metadata || {},
                is_assistant: newMsg.is_assistant || false,
                thinking: false,
                reaction: newMsg.reaction
              };

              return [...prevMessages, transformedMessage];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [user]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          sender_id: user.id,
          receiver_id: '00000000-0000-0000-0000-000000000000',
          read: false,
          is_assistant: false
        });

      if (error) {
        console.error("Error sending message:", error);
      } else {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {loading ? (
                <p>Loading messages...</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${message.sender_id === user?.id ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={message.sender.avatar_url} alt={message.sender.full_name} />
                        <AvatarFallback>{message.sender.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{message.sender.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <time
                      dateTime={message.created_at}
                      className="ml-auto text-xs text-muted-foreground"
                    >
                      {new Date(message.created_at).toLocaleTimeString()}
                    </time>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <Separator />
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
