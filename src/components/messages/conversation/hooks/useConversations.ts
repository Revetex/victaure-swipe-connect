
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { RealtimeChannel } from "@supabase/supabase-js";

export type UserRole = 'professional' | 'business' | 'admin';

export interface ConversationParticipant {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  email?: string | null;
  role: UserRole;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  skills?: string[];
  online_status?: boolean;
  last_seen?: string | null;
}

export interface Conversation {
  id: string;
  participant: ConversationParticipant;
  last_message: string;
  last_message_time: string;
  participant1_id: string;
  participant2_id: string;
}

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
        const formattedConversations: Conversation[] = conversationsData
          .map(conv => {
            const participant = conv.participant as unknown as {
              id: string;
              full_name: string;
              avatar_url: string | null;
              email: string | null;
              role: string;
              bio: string | null;
              phone: string | null;
              city: string | null;
              state: string | null;
              country: string | null;
              skills: string[];
              online_status: boolean;
              last_seen: string | null;
            };

            if (!participant) return null;

            let role: UserRole = 'professional';
            if (participant.role === 'business' || participant.role === 'admin') {
              role = participant.role as UserRole;
            }

            const transformedParticipant: ConversationParticipant = {
              id: participant.id,
              full_name: participant.full_name || '',
              avatar_url: participant.avatar_url,
              email: participant.email,
              role: role,
              bio: participant.bio,
              phone: participant.phone,
              city: participant.city,
              state: participant.state,
              country: participant.country,
              skills: participant.skills || [],
              online_status: participant.online_status,
              last_seen: participant.last_seen
            };

            return {
              id: conv.id,
              participant1_id: conv.participant1_id,
              participant2_id: conv.participant2_id,
              last_message: conv.last_message || '',
              last_message_time: conv.last_message_time || new Date().toISOString(),
              participant: transformedParticipant
            };
          })
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
