
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
import type { Message } from "@/types/messages";

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
          const transformedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender_id: msg.sender_id,
            receiver_id: msg.receiver_id,
            created_at: msg.created_at,
            updated_at: msg.updated_at || msg.created_at,
            read: msg.read ?? false,
            sender: msg.sender,
            receiver: msg.receiver,
            timestamp: msg.created_at,
            message_type: msg.is_assistant ? 'assistant' : 'user',
            status: msg.status || 'sent',
            metadata: {},
            reaction: msg.reaction,
            is_assistant: msg.is_assistant
          }));
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

    const messagesSubscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new) {
            setMessages((prevMessages) => {
              const newMsg = payload.new;
              
              // Vérifier si le message existe déjà
              const messageExists = prevMessages.some(msg => msg.id === newMsg.id);
              if (messageExists) {
                return prevMessages;
              }

              // Vérifier si le message appartient à la conversation en cours
              if (receiver?.id === 'assistant') {
                if (!newMsg.is_assistant && newMsg.sender_id !== user?.id) {
                  return prevMessages;
                }
              } else {
                if (newMsg.sender_id !== user?.id && newMsg.sender_id !== receiver?.id) {
                  return prevMessages;
                }
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
                sender: newMsg.sender,
                receiver: newMsg.receiver,
                timestamp: newMsg.created_at,
                message_type: newMsg.is_assistant ? 'assistant' : 'user',
                status: newMsg.status || 'sent',
                metadata: newMsg.metadata || {},
                is_assistant: newMsg.is_assistant,
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
  }, [user, receiver]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !receiver) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          sender_id: user.id,
          receiver_id: receiver.id,
          read: false,
          is_assistant: receiver.id === 'assistant',
          status: 'sent',
          message_type: 'user'
        });

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
