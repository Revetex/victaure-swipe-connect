
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { UserProfile, transformDatabaseProfile } from "@/types/profile";

interface ConversationParticipant {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  email?: string | null;
  role?: 'professional' | 'business' | 'admin';
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  skills?: string[];
  online_status?: boolean;
  last_seen?: string | null;
  participant2_id?: string;
}

export interface Conversation {
  id: string;
  participant: ConversationParticipant;
  last_message?: string;
  last_message_time?: string;
  participant1_id: string;
  participant2_id: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .eq('participant1_id', user.id);

      if (conversationsError) throw conversationsError;

      if (conversationsData) {
        const participantIds = conversationsData.map(conv => conv.participant2_id);
        
        const { data: participantsData, error: participantsError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', participantIds);

        if (participantsError) throw participantsError;

        const formattedConversations: Conversation[] = conversationsData.map(conv => {
          const participant = participantsData?.find(p => p.id === conv.participant2_id);
          const transformedParticipant = participant ? {
            ...participant,
            role: (participant.role || 'professional') as 'professional' | 'business' | 'admin'
          } : null;

          return {
            id: conv.id,
            participant1_id: conv.participant1_id,
            participant2_id: conv.participant2_id,
            last_message: conv.last_message || '',
            last_message_time: conv.last_message_time || new Date().toISOString(),
            participant: transformedParticipant as ConversationParticipant
          };
        }).filter(conv => conv.participant !== null);

        setConversations(formattedConversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error("Impossible de charger les conversations");
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

  return {
    conversations,
    handleDeleteConversation
  };
}
