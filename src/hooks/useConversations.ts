
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Conversation, Receiver } from '@/types/messages';
import { toast } from 'sonner';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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
        
        if (error) {
          toast.error("Erreur lors du chargement des conversations");
          setIsLoading(false);
          return;
        }
        
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
            
            const participant: Receiver | undefined = profileData ? {
              id: profileData.id,
              full_name: profileData.full_name || 'Unknown',
              avatar_url: profileData.avatar_url,
              online_status: !!profileData.online_status,
              role: profileData.role || 'professional',
              username: profileData.username || profileData.full_name || '',
            } : undefined;
            
            return {
              ...conv,
              participant
            } as Conversation;
          })
        );
        
        setConversations(processedConversations);
      } catch (err) {
        console.error('Error processing conversations:', err);
        toast.error("Erreur lors du traitement des conversations");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
    
    // Souscription aux nouvelles conversations
    const channel = supabase
      .channel('conversations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations' },
        payload => {
          // Actualiser les conversations lors d'un changement
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const getOrCreateConversation = async (receiverId: string): Promise<string | null> => {
    if (!user || !receiverId) return null;
    
    try {
      // Vérifier si une conversation existe déjà
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${receiverId}),and(participant1_id.eq.${receiverId},participant2_id.eq.${user.id})`)
        .single();
      
      if (!error && data) {
        return data.id;
      }
      
      // Créer une nouvelle conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: receiverId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        throw createError;
      }
      
      // Récupérer les informations du participant pour l'ajouter à la liste des conversations
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', receiverId)
        .single();
      
      if (profileData) {
        const participant: Receiver = {
          id: profileData.id,
          full_name: profileData.full_name || 'Unknown',
          avatar_url: profileData.avatar_url,
          online_status: !!profileData.online_status,
          role: profileData.role || 'professional',
          username: profileData.username || profileData.full_name || '',
        };
        
        const newConversation: Conversation = {
          ...newConv,
          participant
        };
        
        setConversations((prev) => [newConversation, ...prev]);
      }
      
      return newConv.id;
    } catch (err) {
      console.error('Error creating conversation:', err);
      toast.error("Impossible de créer la conversation");
      return null;
    }
  };

  return {
    conversations,
    isLoading,
    getOrCreateConversation
  };
}
