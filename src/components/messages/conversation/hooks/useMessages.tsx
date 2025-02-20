
import { useState, useEffect } from "react";
import { Message, Receiver } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function useMessages(receiver: Receiver | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  const loadMessages = async () => {
    if (!user || !receiver) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${receiver.id},receiver_id.eq.${receiver.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data) {
        const formattedMessages: Message[] = data.map(msg => ({
          ...msg,
          metadata: typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata || {},
          deleted_by: typeof msg.deleted_by === 'string' ? JSON.parse(msg.deleted_by) : msg.deleted_by || {},
          sender: {
            id: msg.sender.id,
            email: msg.sender.email,
            full_name: msg.sender.full_name,
            avatar_url: msg.sender.avatar_url,
            role: (msg.sender.role as 'professional' | 'business' | 'admin') || 'professional',
            bio: msg.sender.bio,
            phone: msg.sender.phone,
            city: msg.sender.city,
            state: msg.sender.state,
            country: msg.sender.country || '',
            skills: msg.sender.skills || [],
            latitude: msg.sender.latitude,
            longitude: msg.sender.longitude,
            online_status: msg.sender.online_status || false,
            last_seen: msg.sender.last_seen || new Date().toISOString(),
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          }
        }));
        setMessages(formattedMessages);
      }
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
      }, async (payload) => {
        const { data: messageData, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(*)
          `)
          .eq('id', payload.new.id)
          .single();

        if (error || !messageData) {
          console.error('Error fetching new message:', error);
          return;
        }

        const newMessage: Message = {
          ...messageData,
          metadata: typeof messageData.metadata === 'string' ? JSON.parse(messageData.metadata) : messageData.metadata || {},
          deleted_by: typeof messageData.deleted_by === 'string' ? JSON.parse(messageData.deleted_by) : messageData.deleted_by || {},
          sender: {
            id: messageData.sender.id,
            email: messageData.sender.email,
            full_name: messageData.sender.full_name,
            avatar_url: messageData.sender.avatar_url,
            role: (messageData.sender.role as 'professional' | 'business' | 'admin') || 'professional',
            bio: messageData.sender.bio,
            phone: messageData.sender.phone,
            city: messageData.sender.city,
            state: messageData.sender.state,
            country: messageData.sender.country || '',
            skills: messageData.sender.skills || [],
            latitude: messageData.sender.latitude,
            longitude: messageData.sender.longitude,
            online_status: messageData.sender.online_status || false,
            last_seen: messageData.sender.last_seen || new Date().toISOString(),
            certifications: [],
            education: [],
            experiences: [],
            friends: []
          }
        };
        
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

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
    if (receiver) {
      loadMessages();
      subscribeToMessages();
    }
  }, [receiver]);

  return { messages, handleDeleteMessage, setMessages };
}
