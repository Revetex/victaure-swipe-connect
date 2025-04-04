
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function useConnectionActions(connectionId: string) {
  const queryClient = useQueryClient();

  const handleRemoveFriend = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${connectionId},receiver_id.eq.${connectionId}`);

      if (error) throw error;
      
      // Invalider le cache des connexions
      await queryClient.invalidateQueries({ queryKey: ["connections"] });
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  };

  return {
    handleRemoveFriend
  };
}
