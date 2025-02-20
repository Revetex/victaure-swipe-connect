
import { useReceiver } from "@/hooks/useReceiver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import { Message } from "@/types/messages";
import { ChatMessage } from "../ChatMessage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function ConversationView() {
  const { receiver, setReceiver, setShowConversation } = useReceiver();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const receiverId = searchParams.get('receiver');
    if (receiverId && !receiver) {
      loadUserProfile(receiverId);
    }
  }, [searchParams]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (profile) {
        setReceiver({
          ...profile,
          online_status: 'offline',
          friends: profile.friends || []
        });
        setShowConversation(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Impossible de charger le profil");
    }
  };

  useEffect(() => {
    if (receiver) {
      loadMessages();
      subscribeToMessages();
    }
  }, [receiver]);

  const loadMessages = async () => {
    if (!user || !receiver) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${receiver.id},receiver_id.eq.${receiver.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(data || []);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("Impossible de charger les messages");
    }
  };

  const subscribeToMessages = () => {
    if (!user || !receiver) return;

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${receiver.id},receiver_id=eq.${user.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        scrollToBottom();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBack = () => {
    setShowConversation(false);
    navigate('/messages');
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !receiver) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: messageInput,
          sender_id: user.id,
          receiver_id: receiver.id
        });

      if (error) throw error;
      
      setMessageInput("");
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Impossible d'envoyer le message");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        {receiver && (
          <div className="flex items-center gap-3">
            <UserAvatar
              user={{
                ...receiver,
                online_status: receiver.online_status === 'online',
                friends: []
              }}
              className="h-10 w-10"
            />
            <div>
              <p className="font-medium">{receiver.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {receiver.online_status === 'online' ? 'En ligne' : 'Hors ligne'}
              </p>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id}
              message={message}
              isOwn={message.sender_id === user?.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            placeholder="Écrire un message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
