
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
      // Récupérer d'abord les compteurs actuels du post
      const { data: post } = await supabase
        .from('posts')
        .select('likes, dislikes')
        .eq('id', postId)
        .single();

      if (!post) {
        throw new Error('Post not found');
      }

      // Vérifier si l'utilisateur a déjà réagi
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingReaction) {
        if (existingReaction.reaction_type === type) {
          // Supprimer la réaction si c'est la même
          const { error } = await supabase
            .from('post_reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);

          if (error) throw error;

          // Décrémenter le compteur
          await supabase
            .from('posts')
            .update({
              [type === 'like' ? 'likes' : 'dislikes']: Math.max(0, (type === 'like' ? post.likes : post.dislikes) - 1)
            })
            .eq('id', postId);

        } else {
          // Changer le type de réaction
          const { error } = await supabase
            .from('post_reactions')
            .update({ reaction_type: type })
            .eq('post_id', postId)
            .eq('user_id', userId);

          if (error) throw error;

          // Mettre à jour les compteurs
          await supabase
            .from('posts')
            .update({
              [type === 'like' ? 'likes' : 'dislikes']: (type === 'like' ? post.likes : post.dislikes) + 1,
              [type === 'like' ? 'dislikes' : 'likes']: Math.max(0, (type === 'like' ? post.dislikes : post.likes) - 1)
            })
            .eq('id', postId);
        }
      } else {
        // Créer une nouvelle réaction
        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: type
          });

        if (error) throw error;

        // Incrémenter le compteur
        await supabase
          .from('posts')
          .update({
            [type === 'like' ? 'likes' : 'dislikes']: (type === 'like' ? post.likes : post.dislikes) + 1
          })
          .eq('id', postId);
      }

      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      
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
