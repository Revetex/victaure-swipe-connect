
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useConnectionActions = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const checkExistingRequests = async (profileId: string) => {
    if (!user) return null;

    const { data } = await supabase
      .from('user_connections')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`)
      .single();

    return data;
  };

  const sendRequest = async (receiverId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour envoyer une demande');
      return;
    }

    setIsLoading(true);

    try {
      const existingRequest = await checkExistingRequests(receiverId);

      if (existingRequest) {
        if (existingRequest.status === 'accepted') {
          toast.info('Vous êtes déjà connectés avec cet utilisateur');
          setIsLoading(false);
          return;
        } else if (existingRequest.status === 'pending') {
          toast.info('Une demande de connexion est déjà en cours');
          setIsLoading(false);
          return;
        }
      }

      await supabase.from('user_connections').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        status: 'pending',
        connection_type: 'friend',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      toast.success('Demande de connexion envoyée');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRequest = async (requestId: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      await supabase
        .from('user_connections')
        .delete()
        .eq('id', requestId)
        .eq('sender_id', user.id);

      toast.success('Demande annulée');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la demande:', error);
      toast.error('Erreur lors de l\'annulation de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRequest = async (requestId: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      await supabase
        .from('user_connections')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('receiver_id', user.id);

      toast.success('Demande acceptée');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande:', error);
      toast.error('Erreur lors de l\'acceptation de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      await supabase
        .from('user_connections')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('receiver_id', user.id);

      toast.success('Demande rejetée');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    } catch (error) {
      console.error('Erreur lors du rejet de la demande:', error);
      toast.error('Erreur lors du rejet de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const removeConnection = async (connectionId: string) => {
    if (!user) return;

    setIsLoading(true);

    try {
      await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      toast.success('Connexion supprimée');
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    } catch (error) {
      console.error('Erreur lors de la suppression de la connexion:', error);
      toast.error('Erreur lors de la suppression de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    removeConnection,
    isLoading
  };
};
