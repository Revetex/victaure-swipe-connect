
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type UserRole = 'professional' | 'business' | 'admin';

interface ConversationParticipant {
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
          if (!participant) return null;

          // Ensure role is one of the allowed values
          let role: UserRole = 'professional';
          if (participant.role === 'business' || participant.role === 'admin') {
            role = participant.role;
          }

          const transformedParticipant: ConversationParticipant = {
            id: participant.id,
            full_name: participant.full_name,
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
        }).filter((conv): conv is Conversation => conv !== null);

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
