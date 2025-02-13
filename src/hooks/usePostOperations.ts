
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

    // Optimistic update
    queryClient.setQueryData(["posts"], (oldPosts: any[]) => {
      if (!oldPosts) return [];
      return oldPosts.map(post => {
        if (post.id === postId) {
          const hasReacted = post.reactions?.some((r: any) => r.user_id === userId);
          const oldReaction = post.reactions?.find((r: any) => r.user_id === userId);
          
          return {
            ...post,
            [type === 'like' ? 'likes' : 'dislikes']: hasReacted && oldReaction?.reaction_type === type 
              ? post[type === 'like' ? 'likes' : 'dislikes'] - 1 
              : post[type === 'like' ? 'likes' : 'dislikes'] + 1,
            reactions: hasReacted 
              ? oldReaction?.reaction_type === type
                ? post.reactions.filter((r: any) => r.user_id !== userId)
                : [...post.reactions.filter((r: any) => r.user_id !== userId), { user_id: userId, reaction_type: type }]
              : [...(post.reactions || []), { user_id: userId, reaction_type: type }]
          };
        }
        return post;
      });
    });

    try {
      const { error } = await supabase.rpc('handle_post_reaction', {
        p_post_id: postId,
        p_user_id: userId,
        p_reaction_type: type
      });

      if (error) {
        // Revert optimistic update on error
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        throw error;
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  };

  const handleDelete = async (postId: string, userId: string | undefined) => {
    if (!userId) return;

    // Optimistic update
    queryClient.setQueryData(["posts"], (oldPosts: any[]) => {
      if (!oldPosts) return [];
      return oldPosts.filter(post => post.id !== postId);
    });

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId);

      if (error) {
        // Revert optimistic update on error
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        throw error;
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      throw error;
    }
  };

  const handleHide = async (postId: string, userId: string | undefined) => {
    if (!userId) {
      toast("Vous devez être connecté pour masquer des publications");
      return;
    }

    // Optimistic update
    queryClient.setQueryData(["posts"], (oldPosts: any[]) => {
      if (!oldPosts) return [];
      return oldPosts.filter(post => post.id !== postId);
    });

    try {
      const { error } = await supabase
        .from('hidden_posts')
        .insert({
          post_id: postId,
          user_id: userId
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast("Cette publication est déjà masquée");
        }
        // Revert optimistic update on error
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        throw error;
      }
    } catch (error) {
      console.error('Error hiding post:', error);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      throw error;
    }
  };

  const handleUpdate = async (postId: string, content: string) => {
    // Optimistic update
    queryClient.setQueryData(["posts"], (oldPosts: any[]) => {
      if (!oldPosts) return [];
      return oldPosts.map(post => 
        post.id === postId ? { ...post, content } : post
      );
    });

    try {
      const { error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', postId);

      if (error) {
        // Revert optimistic update on error
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        throw error;
      }
    } catch (error) {
      console.error('Error updating post:', error);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
