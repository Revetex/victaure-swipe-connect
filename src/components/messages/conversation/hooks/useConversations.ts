
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message: string;
  last_message_time: string;
  participant: UserProfile;
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
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant:profiles!conversations_participant2_id_fkey(*)
        `)
        .eq('participant1_id', user.id)
        .not('id', 'is', null);

      if (error) throw error;

      if (data) {
        setConversations(data.map(conv => ({
          ...conv,
          participant: {
            ...conv.participant,
            friends: []
          }
        })));
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
        .rpc('mark_conversation_deleted', { 
          p_user_id: user.id, 
          p_conversation_partner_id: conversationPartnerId
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
