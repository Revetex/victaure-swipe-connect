import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useConnectionActions(profileId: string) {
  const handleAddFriend = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: profileId,
          status: 'pending'
        });

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

      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('sender_id', profileId)
        .eq('receiver_id', user.id);

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

      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${profileId},receiver_id.eq.${profileId}`);

      if (error) throw error;
      toast.success("Connection supprimée");
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de la connection");
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
        .eq('blocked_id', profileId);

      if (blockStatus && blockStatus.length > 0) {
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