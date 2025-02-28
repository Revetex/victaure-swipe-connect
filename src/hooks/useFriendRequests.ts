
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { UserProfile, PendingRequest } from '@/types/profile';

export function useFriendRequests() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<PendingRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<PendingRequest[]>([]);

  // Fonction pour récupérer les demandes d'amis
  const fetchPendingRequests = async (): Promise<PendingRequest[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    
    try {
      // Récupérer les demandes via la vue qui a été créée
      const { data, error } = await supabase
        .from('user_connections_view')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'pending')
        .eq('connection_type', 'friend');

      if (error) throw error;

      // Transformer les données en format PendingRequest
      const requests = (data || []).map(conn => {
        const isIncoming = conn.receiver_id === user.id;
        
        const request: PendingRequest = {
          id: conn.id,
          sender_id: conn.sender_id,
          receiver_id: conn.receiver_id,
          status: conn.status,
          created_at: conn.created_at,
          updated_at: conn.updated_at,
          type: isIncoming ? 'incoming' : 'outgoing',
          sender: {
            id: conn.sender_id,
            full_name: conn.sender_name,
            avatar_url: conn.sender_avatar
          },
          receiver: {
            id: conn.receiver_id,
            full_name: conn.receiver_name,
            avatar_url: conn.receiver_avatar
          }
        };
        
        return request;
      });

      // Séparer les demandes entrantes et sortantes
      const incoming = requests.filter(req => req.type === 'incoming');
      const outgoing = requests.filter(req => req.type === 'outgoing');
      
      // Mettre à jour les états
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
      setPendingRequests(requests);
      
      return requests;
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      toast.error("Erreur lors du chargement des demandes d'amis");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les demandes au montage du composant
  useEffect(() => {
    if (user) {
      fetchPendingRequests();
    }
  }, [user]);

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
      const { data: existingConnections, error: checkError } = await supabase
        .from('user_connections')
        .select('id, status')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .limit(1);

      if (checkError) throw checkError;

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
          fetchPendingRequests();
          return;
        }
      }

      // Créer une nouvelle demande d'ami
      const { error: insertError } = await supabase
        .from('user_connections')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          status: 'pending',
          connection_type: 'friend',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      toast.success("Demande d'ami envoyée");
      fetchPendingRequests();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
      toast.error("Une erreur est survenue lors de l'envoi de la demande");
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

  // Fonction utilitaire pour rafraîchir les demandes d'amis
  const refetchPendingRequests = fetchPendingRequests;

  return {
    sendFriendRequest,
    fetchPendingRequests,
    refetchPendingRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    pendingRequests,
    incomingRequests,
    outgoingRequests,
    isLoading
  };
}
