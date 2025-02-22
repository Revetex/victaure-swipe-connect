
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Conversation } from "../types/conversation.types";
import { transformConversation } from "../utils/conversationTransformers";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadConversations();
      const channel = subscribeToConversations();
      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [user]);

  const subscribeToConversations = () => {
    return supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();
  };

  const loadConversations = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          id,
          participant1_id,
          participant2_id,
          last_message,
          last_message_time,
          participant:profiles!conversations_participant2_id_fkey (
            id,
            full_name,
            avatar_url,
            email,
            role,
            bio,
            phone,
            city,
            state,
            country,
            skills,
            online_status,
            last_seen
          )
        `)
        .eq('participant1_id', user.id)
        .order('last_message_time', { ascending: false });

      if (conversationsError) throw conversationsError;

      if (conversationsData) {
        const formattedConversations = conversationsData
          .map(conv => transformConversation(conv))
          .filter((conv): conv is Conversation => conv !== null);

        setConversations(formattedConversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error("Impossible de charger les conversations");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string, conversationPartnerId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .match({ 
          id: conversationId,
          participant1_id: user.id,
          participant2_id: conversationPartnerId
        });

      if (error) throw error;

      setConversations(prevConversations => 
        prevConversations.filter(c => c.id !== conversationId)
      );
      
      toast.success("Conversation supprimée");
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error("Impossible de supprimer la conversation");
    }
  };

  const createConversation = async (participantId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: participantId,
          last_message_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await loadConversations();
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error("Impossible de créer la conversation");
      return null;
    }
  };

  return {
    conversations,
    loading,
    handleDeleteConversation,
    createConversation
  };
}

export type { Conversation } from '../types/conversation.types';
