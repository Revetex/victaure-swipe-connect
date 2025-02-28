
import { useState, useEffect } from "react";
import { Message, Receiver } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { transformToFullProfile } from "@/utils/profileTransformers";

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
    
    // Pour Mr Victaure, on charge les messages existants
    if (receiver.id === "ai-assistant") {
      setMessages([]); // On commence avec une conversation vide
    } else {
      loadMessages();
    }

    // Configuration du canal en temps réel
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id},sender_id=eq.${receiver.id}`
        },
        async (payload) => {
          console.log('Realtime update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', payload.new.sender_id)
              .single();

            const newMessage = {
              ...payload.new,
              sender: transformToFullProfile(senderProfile),
              metadata: typeof payload.new.metadata === 'string' 
                ? JSON.parse(payload.new.metadata) 
                : payload.new.metadata || {}
            } as Message;

            setMessages(prev => [...prev, newMessage]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime updates');
        }
      });

    return () => {
      console.log('Cleaning up realtime subscription');
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
          sender: transformToFullProfile(msg.sender)
        }));
        setMessages(formattedMessages as Message[]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("Impossible de charger les messages");
    }
  };

  return { messages, handleDeleteMessage, setMessages };
}
