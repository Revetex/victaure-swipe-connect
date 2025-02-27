
import { useState, useEffect } from "react";
import { Message, Receiver } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { transformToFullProfile } from "@/utils/profileTransformers";
import { dbCache } from "@/utils/databaseCache";

export function useMessages(receiver: Receiver | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
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
      
      // Invalider le cache pour ce message
      dbCache.invalidatePattern(`messages:${user?.id}`);
      
      toast.success("Message supprimé");
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error("Impossible de supprimer le message");
    }
  };

  useEffect(() => {
    if (!receiver?.id || !user?.id) return;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const cacheKey = `messages:${user.id}:${receiver.id}`;
        
        const data = await dbCache.get(
          cacheKey,
          async () => {
            console.log("Fetching messages from database...");
            
            const { data, error } = await supabase
              .from('messages')
              .select(`
                *,
                sender:profiles!messages_sender_id_fkey(*)
              `)
              .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`)
              .order('created_at', { ascending: true });

            if (error) {
              throw error;
            }
            
            if (data) {
              // Marquer les messages reçus comme lus
              const unreadMessages = data
                .filter(msg => msg.sender_id === receiver.id && msg.status !== 'read')
                .map(msg => msg.id);
                
              if (unreadMessages.length > 0) {
                // Mise à jour des messages comme lus
                await supabase
                  .from('messages')
                  .update({ status: 'read' })
                  .in('id', unreadMessages);
                  
                // Invalider le cache car nous avons modifié des données
                dbCache.invalidate(cacheKey);
              }
              
              return data.map(msg => ({
                ...msg,
                metadata: typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata || {},
                deleted_by: typeof msg.deleted_by === 'string' ? JSON.parse(msg.deleted_by) : msg.deleted_by || {},
                sender: transformToFullProfile(msg.sender)
              }));
            }
            
            return [];
          },
          10000 // Cache valide pendant 10s
        );

        setMessages(data as Message[]);
      } catch (err) {
        console.error('Error in loadMessages:', err);
        setError(err as Error);
        toast.error("Impossible de charger les messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Écouter les nouveaux messages en temps réel
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(and(receiver_id.eq.${user.id},sender_id.eq.${receiver.id}),and(receiver_id.eq.${receiver.id},sender_id.eq.${user.id}))`
        },
        async (payload) => {
          console.log("Real-time message update:", payload);
          
          // Invalidation du cache pour forcer le rechargement
          dbCache.invalidatePattern(`messages:${user.id}`);
          
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

            // Marquer automatiquement comme lu si c'est un message entrant
            if (payload.new.sender_id === receiver.id) {
              await supabase
                .from('messages')
                .update({ status: 'read' })
                .eq('id', payload.new.id);
            }

            setMessages(prev => [...prev, newMessage]);
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id 
                  ? { ...msg, ...payload.new } 
                  : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [receiver?.id, user?.id]);

  return { messages, isLoading, error, handleDeleteMessage, setMessages };
}
