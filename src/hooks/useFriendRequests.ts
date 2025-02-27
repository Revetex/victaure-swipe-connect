
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { PendingRequest } from '@/types/profile';

export const useFriendRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState<PendingRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Adapter pour utiliser la table user_connections au lieu de friend_requests
  const loadFriendRequests = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Chargement des demandes reçues (où l'utilisateur est le destinataire)
      const { data: incomingData, error: incomingError } = await supabase
        .from('user_connections')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          sender_id,
          receiver_id,
          sender:profiles!user_connections_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!user_connections_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (incomingError) throw incomingError;

      // Chargement des demandes envoyées (où l'utilisateur est l'expéditeur)
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('user_connections')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          sender_id,
          receiver_id,
          sender:profiles!user_connections_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!user_connections_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      if (outgoingError) throw outgoingError;

      // Formater les données pour les adapter au type PendingRequest
      const formattedIncoming = incomingData.map((request) => ({
        id: request.id,
        sender_id: request.sender_id,
        receiver_id: request.receiver_id,
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at,
        sender: {
          id: request.sender?.id || '',
          full_name: request.sender?.full_name || '',
          avatar_url: request.sender?.avatar_url || null
        },
        receiver: {
          id: request.receiver?.id || '',
          full_name: request.receiver?.full_name || '',
          avatar_url: request.receiver?.avatar_url || null
        },
        type: 'incoming' as const
      }));

      const formattedOutgoing = outgoingData.map((request) => ({
        id: request.id,
        sender_id: request.sender_id,
        receiver_id: request.receiver_id,
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at,
        sender: {
          id: request.sender?.id || '',
          full_name: request.sender?.full_name || '',
          avatar_url: request.sender?.avatar_url || null
        },
        receiver: {
          id: request.receiver?.id || '',
          full_name: request.receiver?.full_name || '',
          avatar_url: request.receiver?.avatar_url || null
        },
        type: 'outgoing' as const
      }));

      setIncomingRequests(formattedIncoming);
      setOutgoingRequests(formattedOutgoing);
    } catch (error) {
      console.error('Error loading friend requests:', error);
      toast.error('Impossible de charger les demandes d\'amis');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const acceptFriendRequest = useCallback(async (requestId: string) => {
    if (!user?.id) return;

    try {
      // Mise à jour du statut de la demande
      const { error } = await supabase
        .from('user_connections')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .eq('receiver_id', user.id);

      if (error) throw error;

      // Mise à jour de l'état local
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast.success('Demande d\'ami acceptée');
      
      // Rechargement des demandes
      loadFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Impossible d\'accepter la demande d\'ami');
    }
  }, [user?.id, loadFriendRequests]);

  const rejectFriendRequest = useCallback(async (requestId: string) => {
    if (!user?.id) return;

    try {
      // Mise à jour du statut de la demande
      const { error } = await supabase
        .from('user_connections')
        .update({ status: 'rejected' })
        .eq('id', requestId)
        .eq('receiver_id', user.id);

      if (error) throw error;

      // Mise à jour de l'état local
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast.success('Demande d\'ami rejetée');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Impossible de rejeter la demande d\'ami');
    }
  }, [user?.id]);

  const cancelFriendRequest = useCallback(async (requestId: string) => {
    if (!user?.id) return;

    try {
      // Suppression de la demande
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', requestId)
        .eq('sender_id', user.id);

      if (error) throw error;

      // Mise à jour de l'état local
      setOutgoingRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast.success('Demande d\'ami annulée');
    } catch (error) {
      console.error('Error canceling friend request:', error);
      toast.error('Impossible d\'annuler la demande d\'ami');
    }
  }, [user?.id]);

  const sendFriendRequest = useCallback(async (receiverId: string) => {
    if (!user?.id || !receiverId) return;

    try {
      // Vérification si une demande n'existe pas déjà
      const { data: existingRequest, error: checkError } = await supabase
        .from('user_connections')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingRequest) {
        toast.info('Une demande d\'ami existe déjà avec cet utilisateur');
        return;
      }

      // Création de la demande
      const { error } = await supabase
        .from('user_connections')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Demande d\'ami envoyée');
      
      // Rechargement des demandes
      loadFriendRequests();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Impossible d\'envoyer la demande d\'ami');
    }
  }, [user?.id, loadFriendRequests]);

  // Chargement initial des demandes
  useEffect(() => {
    if (user?.id) {
      loadFriendRequests();
    }
  }, [user?.id, loadFriendRequests]);

  // Rechargement des demandes sur changement d'utilisateur
  useEffect(() => {
    const channel = supabase
      .channel('user_connections_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_connections',
        filter: `or(sender_id.eq.${user?.id},receiver_id.eq.${user?.id})`,
      }, () => {
        loadFriendRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadFriendRequests]);

  return {
    incomingRequests,
    outgoingRequests,
    isLoading,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    sendFriendRequest,
    loadFriendRequests
  };
};
