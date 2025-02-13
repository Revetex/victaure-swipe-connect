import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/useUser";
import { PageLayout } from "@/components/layout/PageLayout";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  sender: {
    full_name: string;
    avatar_url: string;
  };
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
            sender:profiles (
              full_name,
              avatar_url
            )
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          toast.error("Failed to load messages.");
        }

        if (data) {
          setMessages(data as Message[]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to changes in the 'messages' table
    const messagesSubscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new) {
            // Optimistically add the new message to the state
            setMessages((prevMessages) => {
              const newMessage = {
                ...(payload.new as any),
                sender: {
                  full_name: user?.user_metadata?.full_name as string,
                  avatar_url: user?.user_metadata?.avatar_url as string,
                },
              } as Message;
              return [...prevMessages, newMessage];
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
    // Scroll to the bottom when messages are updated
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
          receiver_id: '00000000-0000-0000-0000-000000000000', // Replace with actual receiver ID
          read: false,
        });

      if (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message.");
      } else {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
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
                    className={`flex flex-col ${message.sender_id === user?.id ? 'items-end' : 'items-start'
                      }`}
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
