
import { useState, useEffect } from "react";
import { Message, Receiver } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function useMessages(receiver: Receiver | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user?.id);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success("Message supprimé");
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Impossible de supprimer le message");
    }
  };

  useEffect(() => {
    if (!receiver?.id || !user?.id) return;
    
    // Ne pas afficher de message de présentation pour Mr Victaure
    if (receiver.id !== "ai-assistant") {
      loadMessages();
    }

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
          } else if (payload.eventType === 'DELETE') {
            const deletedMessage = payload.old as Message;
            setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [receiver?.id, user?.id]);

  const loadMessages = async () => {
    try {
      if (!user || !receiver) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data) {
        const formattedMessages = data.map(msg => ({
          ...msg,
          metadata: typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata || {},
          deleted_by: typeof msg.deleted_by === 'string' ? JSON.parse(msg.deleted_by) : msg.deleted_by || {},
          sender: msg.sender
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("Impossible de charger les messages");
    }
  };

  return { messages, handleDeleteMessage, setMessages };
}
