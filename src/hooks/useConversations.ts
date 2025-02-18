
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export const useConversations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startConversation = async (userId: string, partnerId: string) => {
    try {
      setIsLoading(true);

      // Vérifier si une conversation existe déjà
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
        .or(`participant1_id.eq.${partnerId},participant2_id.eq.${partnerId}`)
        .single();

      if (existingConversation) {
        console.log("Conversation existante trouvée:", existingConversation);
        return existingConversation;
      }

      // Si aucune conversation n'existe, en créer une nouvelle
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert([
          {
            participant1_id: userId,
            participant2_id: partnerId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'active'
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Si l'erreur est due à un doublon, on récupère la conversation existante
          const { data: conv } = await supabase
            .from('conversations')
            .select('*')
            .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
            .or(`participant1_id.eq.${partnerId},participant2_id.eq.${partnerId}`)
            .single();
          
          return conv;
        }
        throw error;
      }

      return newConversation;
    } catch (error: any) {
      console.error("Erreur lors de la création de la conversation:", error);
      toast.error("Impossible de démarrer la conversation");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConversations = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:participant1_id(full_name, avatar_url),
          participant2:participant2_id(full_name, avatar_url)
        `)
        .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
      toast.error("Impossible de charger les conversations");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversation = async (conversationId: string, updates: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', conversationId);

      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la conversation:", error);
      toast.error("Impossible de mettre à jour la conversation");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startConversation,
    getConversations,
    updateConversation,
    isLoading
  };
};
