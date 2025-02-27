
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function useConnectionActions(profileId?: string) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddFriend = async () => {
    if (!profileId || !user?.id) {
      toast.error("Vous devez être connecté pour ajouter un ami");
      return;
    }

    try {
      setIsProcessing(true);

      // Vérifier si la demande existe déjà
      const { data: existingRequests, error: checkError } = await supabase
        .from('user_connections')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`)
        .not('status', 'eq', 'rejected');

      if (checkError) throw checkError;

      if (existingRequests && existingRequests.length > 0) {
        toast.error("Une demande d'ami existe déjà avec cet utilisateur");
        return;
      }

      // Créer une nouvelle demande d'ami
      const { error } = await supabase
        .from('user_connections')
        .insert({
          sender_id: user.id,
          receiver_id: profileId,
          status: 'pending',
          connection_type: 'friend',
          visibility: 'public'
        });

      if (error) throw error;

      toast.success("Demande d'ami envoyée avec succès");
    } catch (error) {
      console.error('Error adding friend:', error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptFriend = async () => {
    if (!profileId || !user?.id) {
      toast.error("Vous devez être connecté pour accepter cette demande");
      return;
    }

    try {
      setIsProcessing(true);

      // Récupérer l'ID de la demande
      const { data: requestData, error: requestError } = await supabase
        .from('user_connections')
        .select('id')
        .eq('sender_id', profileId)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .single();

      if (requestError) throw requestError;

      // Accepter la demande
      const { error } = await supabase.rpc('accept_friend_request', {
        p_request_id: requestData.id,
        p_user_id: user.id
      });

      if (error) throw error;

      toast.success("Demande d'ami acceptée");
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error("Erreur lors de l'acceptation de la demande");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!profileId || !user?.id) {
      toast.error("Vous devez être connecté pour supprimer cet ami");
      return;
    }

    try {
      setIsProcessing(true);

      // Récupérer l'ID de la connexion
      const { data: connectionData, error: connectionError } = await supabase
        .from('user_connections')
        .select('id, status')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`)
        .maybeSingle();

      if (connectionError) throw connectionError;
      if (!connectionData) {
        toast.error("Aucune connexion trouvée avec cet utilisateur");
        return;
      }

      // Si c'est une demande en attente envoyée par l'utilisateur
      if (connectionData.status === 'pending') {
        const { error } = await supabase.rpc('cancel_friend_request', {
          p_request_id: connectionData.id,
          p_user_id: user.id
        });
        
        if (error) throw error;
        toast.success("Demande d'ami annulée");
      } 
      // Si c'est une connexion active
      else if (connectionData.status === 'accepted') {
        const { error } = await supabase.rpc('remove_friend', {
          p_connection_id: connectionData.id,
          p_user_id: user.id
        });
        
        if (error) throw error;
        toast.success("Ami supprimé de votre liste");
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de la connexion");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleBlock = async (profileId?: string) => {
    if (!profileId || !user?.id) {
      toast.error("Vous devez être connecté pour bloquer cet utilisateur");
      return;
    }

    try {
      setIsProcessing(true);

      // Vérifier si l'utilisateur est déjà bloqué
      const { data: existingBlock, error: checkError } = await supabase
        .from('blocked_users')
        .select('id')
        .eq('blocker_id', user.id)
        .eq('blocked_id', profileId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingBlock) {
        // Débloquer l'utilisateur
        const { error } = await supabase
          .from('blocked_users')
          .delete()
          .eq('id', existingBlock.id);

        if (error) throw error;
        toast.success("Utilisateur débloqué");
      } else {
        // Bloquer l'utilisateur
        const { error } = await supabase
          .from('blocked_users')
          .insert({
            blocker_id: user.id,
            blocked_id: profileId
          });

        if (error) throw error;
        toast.success("Utilisateur bloqué");

        // Supprimer toute connexion existante
        await supabase
          .from('user_connections')
          .delete()
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`);
      }
    } catch (error) {
      console.error('Error toggling block status:', error);
      toast.error("Erreur lors de la modification du statut de blocage");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
    isProcessing
  };
}
