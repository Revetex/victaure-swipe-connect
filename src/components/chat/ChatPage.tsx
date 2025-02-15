import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Send, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/useUser";
import { useReceiver } from "@/hooks/useReceiver";
import { PageLayout } from "@/components/layout/PageLayout";
import { ChatMessage } from "./ChatMessage";
import { toast } from "sonner";
import { Message, MessageSender, transformDatabaseMessage } from "@/types/messages";
import { Json } from "@/types/database/auth";

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  const { receiver, setReceiver } = useReceiver();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        if (!user || !receiver) return;

        let query = supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey (
              id,
              full_name,
              avatar_url,
              online_status,
              last_seen
            ),
            receiver:profiles!messages_receiver_id_fkey (
              id,
              full_name,
              avatar_url,
              online_status,
              last_seen
            )
          `)
          .order('created_at', { ascending: true });

        if (receiver.id === 'assistant') {
          query = query
            .eq('receiver_id', user.id)
            .eq('is_assistant', true);
        } else {
          query = query.or(
            `and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),` +
            `and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`
          );
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          const transformedMessages = data.map(msg => transformDatabaseMessage(msg));
          setMessages(transformedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Erreur lors du chargement des messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, receiver]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !receiver) return;

    try {
      const messageData = {
        content: newMessage,
        sender_id: user.id,
        receiver_id: receiver.id,
        read: false,
        is_assistant: receiver.id === 'assistant',
        status: 'sent' as const,
        message_type: receiver.id === 'assistant' ? 'assistant' as const : 'user' as const,
        metadata: {
          timestamp: new Date().toISOString(),
          type: 'chat'
        } as Record<string, Json>
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) {
        console.error("Error sending message:", error);
        toast.error("Erreur lors de l'envoi du message");
      } else {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)] relative">
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 p-4 border-b">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {loading ? (
                <p>Loading messages...</p>
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
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
              placeholder="Écrivez votre message..."
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
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
