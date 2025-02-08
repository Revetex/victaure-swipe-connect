
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "./useNotifications";

interface UseReactionsProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  onLike: () => void;
  onDislike: () => void;
}

export const useReactions = ({
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  onLike,
  onDislike,
}: UseReactionsProps) => {
  const { toast } = useToast();
  const { createNotification } = useNotifications();

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!currentUserId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour réagir",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.rpc('handle_post_reaction', {
        p_post_id: postId,
        p_user_id: currentUserId,
        p_reaction_type: type
      });

      if (error) throw error;

      // Update the likes/dislikes count in the posts table
      const { data: reactions } = await supabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId);

      const newLikes = reactions?.filter(r => r.reaction_type === 'like').length || 0;
      const newDislikes = reactions?.filter(r => r.reaction_type === 'dislike').length || 0;

      await supabase
        .from('posts')
        .update({
          likes: newLikes,
          dislikes: newDislikes
        })
        .eq('id', postId);

      // Call the appropriate callback
      if (type === 'like') {
        onLike();
        if (postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau j\'aime',
            `${userEmail} a aimé votre publication`
          );
        }
      } else {
        onDislike();
        if (postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau je n\'aime pas',
            `${userEmail} n'a pas aimé votre publication`
          );
        }
      }

      toast({
        title: "Réaction ajoutée",
        description: `Vous avez ${type === 'like' ? 'aimé' : 'pas aimé'} cette publication`,
      });

    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réaction",
        variant: "destructive"
      });
    }
  };

  return { handleReaction };
};
