import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePostOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleReaction = async (postId: string, userId: string | undefined, type: 'like' | 'dislike') => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to react to posts",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingReaction) {
        if (existingReaction.reaction_type === type) {
          await supabase
            .from('post_reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);
        } else {
          await supabase
            .from('post_reactions')
            .update({ reaction_type: type })
            .eq('post_id', postId)
            .eq('user_id', userId);
        }
      } else {
        await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: type
          });
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (postId: string, userId: string | undefined) => {
    if (!userId) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
    }
  };

  const handleHide = async (postId: string, userId: string | undefined) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to hide posts",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('hidden_posts')
      .insert({
        post_id: postId,
        user_id: userId
      });

    if (error) {
      console.error('Hide post error:', error);
      toast({
        title: "Error",
        description: "Failed to hide post",
        variant: "destructive"
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Post hidden successfully"
      });
    }
  };

  return {
    handleReaction,
    handleDelete,
    handleHide
  };
};