
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Conversation, Receiver } from '@/types/messages';
import { toast } from 'sonner';
import { normalizeConversation, sortConversationsByDate } from '@/utils/conversationUtils';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Charger les conversations
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        // Récupérer toutes les conversations de l'utilisateur
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setConversations([]);
          setIsLoading(false);
          return;
        }
        
        // Traiter chaque conversation pour obtenir les détails du participant
        const processedConversations = await Promise.all(
          data.map(async (conv) => {
            const isParticipant1 = conv.participant1_id === user.id;
            const participantId = isParticipant1 ? conv.participant2_id : conv.participant1_id;
            
            // Récupérer les informations du profil de l'autre participant
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', participantId)
              .single();
            
            return normalizeConversation({
              ...conv,
              participant: profileData ? {
                id: profileData.id,
                full_name: profileData.full_name || 'Unknown',
                avatar_url: profileData.avatar_url,
                online_status: !!profileData.online_status,
                role: profileData.role || 'professional',
                username: profileData.username || profileData.full_name || '',
              } as Receiver : undefined
            });
          })
        );
        
        // Trier par date de dernier message
        const sortedConversations = processedConversations.sort(sortConversationsByDate);
        setConversations(sortedConversations);
      } catch (err) {
        console.error('Erreur lors du chargement des conversations:', err);
        toast.error('Impossible de charger les conversations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
    
    // Souscription aux changements de conversations
    const channel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Créer ou récupérer une conversation avec un utilisateur
  const getOrCreateConversation = useCallback(
    async (receiverId: string): Promise<{ conversationId: string; receiver: Receiver } | null> => {
      if (!user || !receiverId) return null;

      try {
        // Vérifier si une conversation existe déjà
        let { data: conversation, error } = await supabase
          .from('conversations')
          .select('*')
          .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${receiverId}),and(participant1_id.eq.${receiverId},participant2_id.eq.${user.id})`)
          .single();

        if (error || !conversation) {
          // Créer une nouvelle conversation
          const { data: newConversation, error: createError } = await supabase
            .from('conversations')
            .insert([
              {
                participant1_id: user.id,
                participant2_id: receiverId
              }
            ])
            .select()
            .single();

          if (createError) throw createError;
          conversation = newConversation;
        }

        // Récupérer les informations du destinataire
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', receiverId)
          .single();

        if (profileError) throw profileError;

        const receiver: Receiver = {
          id: profile.id,
          full_name: profile.full_name || null,
          avatar_url: profile.avatar_url || null,
          online_status: !!profile.online_status,
          role: profile.role || 'professional',
          username: profile.username || profile.full_name || '',
          email: profile.email || null,
          last_seen: profile.last_seen || null
        };

        return {
          conversationId: conversation.id,
          receiver
        };
      } catch (err) {
        console.error('Erreur lors de la récupération/création de conversation:', err);
        toast.error('Impossible de créer une conversation');
        return null;
      }
    },
    [user]
  );

  return {
    conversations,
    isLoading,
    getOrCreateConversation
  };
}
