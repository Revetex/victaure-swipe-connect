
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { friendRequestsAdapter } from "@/utils/connectionAdapters";

export function useConnectionActions(profileId: string) {
  const handleAddFriend = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await friendRequestsAdapter.createFriendRequest(user.id, profileId);

      if (error) throw error;
      toast.success("Demande de connexion envoyée");
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };

  const handleAcceptFriend = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Trouver l'ID de la demande
      const { data: pendingRequests } = await friendRequestsAdapter.findPendingRequests(user.id);
      
      if (!pendingRequests || pendingRequests.length === 0) {
        throw new Error("Demande d'ami introuvable");
      }
      
      const request = pendingRequests.find(req => 
        req.sender_id === profileId && req.receiver_id === user.id);
      
      if (!request) {
        throw new Error("Demande d'ami introuvable");
      }

      const { error } = await friendRequestsAdapter.acceptFriendRequest(request.id);

      if (error) throw error;
      toast.success("Demande de connexion acceptée");
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error("Erreur lors de l'acceptation de la demande");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Trouver toutes les connexions entre ces utilisateurs
      const { data: connections } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`);

      if (!connections || connections.length === 0) {
        throw new Error("Connexion introuvable");
      }
      
      // Supprimer toutes les connexions trouvées
      for (const connection of connections) {
        await friendRequestsAdapter.deleteFriendRequest(connection.id);
      }
      
      toast.success("Connexion supprimée");
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de la connexion");
    }
  };

  const handleToggleBlock = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: blockStatus } = await supabase
        .from('blocked_users')
        .select('*')
        .eq('blocker_id', user.id)
        .eq('blocked_id', profileId)
        .maybeSingle();

      if (blockStatus) {
        const { error } = await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', user.id)
          .eq('blocked_id', profileId);

        if (error) throw error;
        toast.success("Utilisateur débloqué");
      } else {
        const { error } = await supabase
          .from('blocked_users')
          .insert({
            blocker_id: user.id,
            blocked_id: profileId
          });

        if (error) throw error;
        toast.success("Utilisateur bloqué");
      }
    } catch (error) {
      console.error('Error toggling block:', error);
      toast.error("Erreur lors du blocage/déblocage");
    }
  };

  const handleRequestCV = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("notifications").insert({
        user_id: profileId,
        title: "Demande de CV",
        message: `${user.email} aimerait consulter votre CV`,
      });

      toast.success("Demande de CV envoyée");
    } catch (error) {
      console.error('Error requesting CV:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };

  return {
    handleAddFriend,
    handleAcceptFriend,
    handleRemoveFriend,
    handleToggleBlock,
    handleRequestCV,
  };
}
