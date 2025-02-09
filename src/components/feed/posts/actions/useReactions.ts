
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
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId)
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (existingReaction && existingReaction.reaction_type === type) {
        // Si la même réaction existe déjà, on la supprime
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUserId);

        if (error) throw error;

        // Mettre à jour les compteurs
        if (type === 'like') {
          onLike();
        } else {
          onDislike();
        }

        toast({
          title: "Réaction supprimée",
          description: `Vous avez retiré votre ${type === 'like' ? 'j\'aime' : 'je n\'aime pas'}`,
        });

        return;
      }

      const { error } = await supabase.rpc('handle_post_reaction', {
        p_post_id: postId,
        p_user_id: currentUserId,
        p_reaction_type: type
      });

      if (error) throw error;

      // Mettre à jour les compteurs
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

      if (type === 'like') {
        onLike();
        if (postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau j\'aime',
            `${userEmail} a aimé votre publication`,
            'like'
          );
        }
      } else {
        onDislike();
        if (postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau je n\'aime pas',
            `${userEmail} n'a pas aimé votre publication`,
            'like'
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
