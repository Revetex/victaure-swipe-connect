
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Message, Receiver } from '@/types/messages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { MessageItem } from './components/MessageItem';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ConversationHeaderAdapter } from './adapters/ConversationHeaderAdapter';

interface ConversationViewProps {
  conversation?: any;
  onBack?: () => void;
}

export function ConversationView({ 
  conversation, 
  onBack, 
}: ConversationViewProps) {
  const { id: conversationId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState<Receiver>({
    id: '',
    full_name: '',
    avatar_url: null,
    online_status: false,
    last_seen: null,
    username: '',
    phone: '',
    city: '',
    state: '',
    country: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(id, full_name, avatar_url)
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        // Cast the data to Message[] after ensuring it's valid
        const processedMessages = (data || []).map(msg => {
          // Handle potential errors in the sender join
          const senderData = msg.sender && typeof msg.sender === 'object' 
            ? msg.sender 
            : { id: msg.sender_id, full_name: 'Unknown', avatar_url: null };
            
          return {
            ...msg,
            sender: senderData as any
          } as Message;
        });

        setMessages(processedMessages);
        scrollToBottom();
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: "Impossible de charger les messages."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        payload => {
          const newMessage = payload.new as Message;
          setMessages(prevMessages => [...prevMessages, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [conversationId, scrollToBottom, toast]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchReceiver = async () => {
      try {
        const { data: conversationData, error: conversationError } = await supabase
          .from('conversations')
          .select('participant1_id, participant2_id')
          .eq('id', conversationId)
          .single();

        if (conversationError) {
          throw conversationError;
        }

        const receiverId = (conversationData?.participant1_id === user?.id) ? conversationData?.participant2_id : conversationData?.participant1_id;

        if (!receiverId) {
          console.error('Receiver ID not found');
          return;
        }

        const { data: receiverData, error: receiverError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', receiverId)
          .single();

        if (receiverError) {
          throw receiverError;
        }

        // Ensure the receiver data conforms to the Receiver type
        setReceiver({
          id: receiverId,
          full_name: receiverData?.full_name || 'Unknown',
          avatar_url: receiverData?.avatar_url || null,
          online_status: !!receiverData?.online_status,
          last_seen: receiverData?.last_seen || null,
          // Add optional fields with fallbacks
          username: receiverData?.username || '',
          phone: receiverData?.phone || null,
          city: receiverData?.city || null,
          state: receiverData?.state || null,
          country: receiverData?.country || null,
          // Add any other required fields from Receiver type
          email: receiverData?.email || null,
          role: (receiverData?.role as any) || 'professional',
          bio: receiverData?.bio || null
        });
      } catch (error: any) {
        console.error('Error fetching receiver:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: "Impossible de charger les informations du destinataire."
        });
      }
    };

    fetchReceiver();
  }, [conversationId, user?.id, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !receiver.id) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          sender_id: user.id,
          receiver_id: receiver.id,
          conversation_id: conversationId,
        });

      if (error) {
        throw error;
      }

      setNewMessage('');
      scrollToBottom();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible d'envoyer le message."
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Date inconnue";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ConversationHeaderAdapter 
        receiver={receiver} 
        onBack={onBack} 
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-muted-foreground">Chargement des messages...</div>
        ) : (
          messages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              isOwnMessage={message.sender_id === user?.id}
              timestamp={formatTimestamp(message.created_at)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[#64B5D9]/10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Écrire un message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="bg-background border-[#64B5D9]/20 text-foreground placeholder:text-muted-foreground"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
}
