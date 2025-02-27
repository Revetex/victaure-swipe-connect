
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function useConnectionActions(profileId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { sendFriendRequest, acceptFriendRequest, refetchPendingRequests } = useFriendRequests();

  // Fetch the connection request ID when needed
  const getConnectionRequest = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`)
        .eq('status', 'pending')
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching connection request:', error);
      return null;
    }
  }, [user?.id, profileId]);

  // Handle adding a friend
  const handleAddFriend = useCallback(async () => {
    if (!user?.id || isLoading) return;
    setIsLoading(true);

    try {
      await sendFriendRequest(profileId);
      toast.success('Demande d\'ami envoyée');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Erreur lors de l\'envoi de la demande d\'ami');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profileId, sendFriendRequest, isLoading]);

  // Handle accepting a friend request
  const handleAcceptFriend = useCallback(async () => {
    if (!user?.id || isLoading) return;
    setIsLoading(true);

    try {
      const request = await getConnectionRequest();
      if (request?.id) {
        await acceptFriendRequest(request.id);
        toast.success('Demande d\'ami acceptée');
      } else {
        toast.error('Demande d\'ami introuvable');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Erreur lors de l\'acceptation de la demande d\'ami');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getConnectionRequest, acceptFriendRequest, isLoading]);

  // Handle removing a friend
  const handleRemoveFriend = useCallback(async () => {
    if (!user?.id || isLoading) return;
    setIsLoading(true);

    try {
      // Get the connection
      const { data, error } = await supabase
        .from('user_connections')
        .select('id, status')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error('Connexion introuvable');
        return;
      }

      // If it's a pending request
      if (data.status === 'pending') {
        // Delete it directly
        const { error: deleteError } = await supabase
          .from('user_connections')
          .delete()
          .eq('id', data.id);
          
        if (deleteError) throw deleteError;
        toast.success('Demande annulée');
      } 
      // If it's an accepted friendship
      else if (data.status === 'accepted') {
        // Delete the connection
        const { error: deleteError } = await supabase
          .from('user_connections')
          .delete()
          .eq('id', data.id);
          
        if (deleteError) throw deleteError;
        toast.success('Ami supprimé');
      }

      // Refresh the friend requests
      if (refetchPendingRequests) {
        refetchPendingRequests();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Erreur lors de la suppression de l\'ami');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profileId, isLoading, refetchPendingRequests]);

  // Handle blocking a user
  const handleToggleBlock = useCallback(async (userId: string) => {
    if (!user?.id || isLoading) return;
    setIsLoading(true);

    try {
      // Check if already blocked
      const { data: existingBlock, error: checkError } = await supabase
        .from('blocked_users')
        .select('*')
        .eq('blocker_id', user.id)
        .eq('blocked_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingBlock) {
        // If blocked, unblock
        const { error } = await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', user.id)
          .eq('blocked_id', userId);

        if (error) throw error;
        toast.success('Utilisateur débloqué');
      } else {
        // If not blocked, block
        const { error } = await supabase
          .from('blocked_users')
          .insert({
            blocker_id: user.id,
            blocked_id: userId
          });

        if (error) throw error;
        toast.success('Utilisateur bloqué');
      }
    } catch (error) {
      console.error('Error toggling block status:', error);
      toast.error('Erreur lors du changement du statut de blocage');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isLoading]);

  return {
    isLoading,
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock
  };
}
