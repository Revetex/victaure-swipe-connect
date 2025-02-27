
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
        
        // Obtenir ou créer une conversation entre les deux utilisateurs
        const { data: conversationData, error: conversationError } = await supabase
          .from('user_conversations')
          .select('id')
          .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${receiver.id}),and(participant1_id.eq.${receiver.id},participant2_id.eq.${user.id})`)
          .single();

        // Si aucune conversation n'existe, la créer
        let conversationId: string;
        if (conversationError || !conversationData) {
          // Déterminer l'ordre des participants pour la contrainte d'unicité
          const [participant1_id, participant2_id] = 
            user.id < receiver.id 
              ? [user.id, receiver.id] 
              : [receiver.id, user.id];
          
          const { data: newConversation, error: createError } = await supabase
            .from('user_conversations')
            .insert({
              participant1_id,
              participant2_id
            })
            .select('id')
            .single();
            
          if (createError) throw createError;
          conversationId = newConversation.id;
        } else {
          conversationId = conversationData.id;
        }
        
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
              .eq('conversation_id', conversationId)
              .order('created_at', { ascending: true });

            if (error) {
              throw error;
            }
            
            if (data) {
              // Marquer les messages comme lus
              const { error: markReadError } = await supabase
                .from('user_conversations')
                .update({
                  participant1_last_read: user.id === conversationData?.participant1_id ? new Date().toISOString() : undefined,
                  participant2_last_read: user.id === conversationData?.participant2_id ? new Date().toISOString() : undefined
                })
                .eq('id', conversationId);
              
              // Marquer aussi les messages individuels
              const unreadMessages = data
                .filter(msg => msg.sender_id === receiver.id && msg.status !== 'read')
                .map(msg => msg.id);
                
              if (unreadMessages.length > 0) {
                await supabase
                  .from('messages')
                  .update({ status: 'read' })
                  .in('id', unreadMessages);
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
