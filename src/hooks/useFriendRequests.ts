
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { UserProfile, PendingRequest } from '@/types/profile';

export function useFriendRequests() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  const sendFriendRequest = async (receiverId: string): Promise<void> => {
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer une demande d'ami");
      return;
    }

    if (user.id === receiverId) {
      toast.error("Vous ne pouvez pas vous envoyer une demande d'ami à vous-même");
      return;
    }

    setIsLoading(true);

    try {
      // Vérifier si une connexion existe déjà entre ces utilisateurs
      const { data: existingConnections } = await supabase
        .from('user_connections')
        .select('id, status')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .limit(1);

      if (existingConnections && existingConnections.length > 0) {
        const connection = existingConnections[0];
        
        if (connection.status === 'accepted') {
          toast.info("Vous êtes déjà ami avec cette personne");
          return;
        } else if (connection.status === 'pending') {
          toast.info("Une demande est déjà en attente avec cette personne");
          return;
        } else if (connection.status === 'rejected') {
          // Mettre à jour la connexion existante
          await supabase
            .from('user_connections')
            .update({ 
              status: 'pending',
              updated_at: new Date().toISOString()
            })
            .eq('id', connection.id);
            
          toast.success("Demande d'ami envoyée");
          return;
        }
      }

      // Créer une nouvelle demande d'ami
      await supabase
        .from('user_connections')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          status: 'pending',
          connection_type: 'friend',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      toast.success("Demande d'ami envoyée");
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
      toast.error("Une erreur est survenue lors de l'envoi de la demande");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequests = async (): Promise<PendingRequest[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    
    try {
      // Récupérer les demandes reçues
      const { data: incomingRequests, error: incomingError } = await supabase
        .from('user_connections')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          updated_at,
          sender:profiles(id, full_name, avatar_url),
          receiver:profiles(id, full_name, avatar_url)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .eq('connection_type', 'friend');

      if (incomingError) throw incomingError;

      // Récupérer les demandes envoyées
      const { data: outgoingRequests, error: outgoingError } = await supabase
        .from('user_connections')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at,
          updated_at,
          sender:profiles(id, full_name, avatar_url),
          receiver:profiles(id, full_name, avatar_url)
        `)
        .eq('sender_id', user.id)
        .eq('status', 'pending')
        .eq('connection_type', 'friend');

      if (outgoingError) throw outgoingError;

      // Marquer les demandes comme entrantes ou sortantes
      const incoming = (incomingRequests || []).map(req => ({
        ...req,
        type: 'incoming' as const
      }));
      
      const outgoing = (outgoingRequests || []).map(req => ({
        ...req,
        type: 'outgoing' as const
      }));

      // Combiner et trier les demandes par date
      const allRequests = [...incoming, ...outgoing].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Mettre à jour l'état
      setPendingRequests(allRequests);
      return allRequests;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      toast.error("Erreur lors du chargement des demandes d'amis");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId: string): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Mettre à jour le statut de la demande
      const { error } = await supabase
        .from('user_connections')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('receiver_id', user.id);

      if (error) throw error;
      
      // Actualiser la liste des demandes
      await fetchPendingRequests();
      
      toast.success("Demande d'ami acceptée");
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const rejectFriendRequest = async (requestId: string): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Mettre à jour le statut de la demande
      const { error } = await supabase
        .from('user_connections')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('receiver_id', user.id);

      if (error) throw error;
      
      // Actualiser la liste des demandes
      await fetchPendingRequests();
      
      toast.success("Demande d'ami refusée");
    } catch (error) {
      console.error('Erreur lors du refus de la demande:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelFriendRequest = async (requestId: string): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Supprimer la demande
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', requestId)
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      
      // Actualiser la liste des demandes
      await fetchPendingRequests();
      
      toast.success("Demande d'ami annulée");
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la demande:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendFriendRequest,
    fetchPendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    pendingRequests,
    isLoading
  };
}
