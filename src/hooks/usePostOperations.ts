
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePostOperations = () => {
  const queryClient = useQueryClient();

  const handleReaction = async (postId: string, userId: string | undefined, type: 'like' | 'dislike') => {
    if (!userId) {
      toast("Vous devez être connecté pour réagir aux publications");
      return;
    }

    try {
      const { error } = await supabase.rpc('handle_post_reaction', {
        p_post_id: postId,
        p_user_id: userId,
        p_reaction_type: type
      });

      if (error) throw error;

      // Invalidate queries to refresh the posts data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast("Une erreur est survenue lors de la réaction");
    }
  };

  const handleDelete = async (postId: string, userId: string | undefined) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast("Publication supprimée");
    } catch (error) {
      console.error('Error deleting post:', error);
      toast("Impossible de supprimer la publication");
    }
  };

  const handleHide = async (postId: string, userId: string | undefined) => {
    if (!userId) {
      toast("Vous devez être connecté pour masquer des publications");
      return;
    }

    try {
      const { data: existingHide } = await supabase
        .from('hidden_posts')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingHide) {
        toast("Cette publication est déjà masquée");
        return;
      }

      const { error } = await supabase
        .from('hidden_posts')
        .insert({
          post_id: postId,
          user_id: userId
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast("Publication masquée");
    } catch (error) {
      console.error('Error hiding post:', error);
      toast("Impossible de masquer la publication");
    }
  };

  const handleUpdate = async (postId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', postId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  return {
    handleReaction,
    handleDelete,
    handleHide,
    handleUpdate
  };
};
