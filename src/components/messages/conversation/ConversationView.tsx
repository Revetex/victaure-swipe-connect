import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message, Receiver, Conversation } from "@/types/messages";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useThemeContext } from "@/components/ThemeProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationHeaderAdapter } from "./ConversationHeaderAdapter";
import { useReceiver } from "@/hooks/useReceiver";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ConversationViewProps {
  onBack?: () => void;
}

export function ConversationView({ onBack }: ConversationViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { receiver } = useReceiver();
  const { isDark } = useThemeContext();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!receiver?.id || !user?.id) return;

    const fetchConversation = async () => {
      try {
        const { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('*')
          .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${receiver.id}),and(participant1_id.eq.${receiver.id},participant2_id.eq.${user.id})`)
          .single();

        if (conversationError) {
          console.error('Error fetching conversation:', conversationError);
          return;
        }

        setConversation(conversationData);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    };

    fetchConversation();
  }, [receiver?.id, user?.id]);

  useEffect(() => {
    if (!receiver?.id || !conversation?.id) return;
  
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles(id, full_name, avatar_url)
          `)
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true });
      
        if (error) {
          console.error('Error fetching messages:', error);
          setLoading(false);
          return;
        }
      
        const typedMessages = data.map(msg => {
          const senderData = typeof msg.sender === 'object' && msg.sender && !('error' in msg.sender)
            ? msg.sender 
            : { id: msg.sender_id, full_name: "Unknown", avatar_url: null };
          
          return {
            ...msg,
            sender: senderData as Receiver
          };
        }) as Message[];
      
        setMessages(typedMessages);
        setLoading(false);
      } catch (error) {
        console.error('Error in messages fetch:', error);
        setLoading(false);
      }
    };
  
    fetchMessages();
  
    const messagesSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.id}` },
        payload => {
          setMessages(prevMessages => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [receiver?.id, conversation?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !receiver?.id || !conversation?.id) return;

    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage,
            sender_id: user?.id,
            receiver_id: receiver.id,
            conversation_id: conversation.id
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ConversationHeaderAdapter
        receiver={receiver}
        onBack={onBack}
      />

      <div className="flex-1 overflow-hidden relative">
        <ScrollArea ref={scrollRef} className="h-full w-full p-4">
          <div className="flex flex-col gap-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2 mb-4",
                  msg.sender_id === user?.id ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender_id !== user?.id && msg.sender && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.avatar_url || ""} alt={msg.sender.full_name || "Sender"} />
                    <AvatarFallback>
                      {msg.sender.full_name?.substring(0, 2).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "px-4 py-2 rounded-lg max-w-[75%]",
                    msg.sender_id === user?.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <div
                    className={cn(
                      "text-xs mt-1",
                      msg.sender_id === user?.id
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(new Date(msg.created_at), "HH:mm")}
                  </div>
                </div>

                {msg.sender_id === user?.id && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || ""} alt="You" />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.substring(0, 2).toUpperCase() ||
                        user.email?.substring(0, 2).toUpperCase() ||
                        "?"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            Chargement des messages...
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Écrire un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            Envoyer
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
