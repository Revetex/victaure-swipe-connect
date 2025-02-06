
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      // First, check if the user has already reacted
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', currentUserId)
        .maybeSingle();

      let action: 'insert' | 'delete' | 'update' = 'insert';
      
      if (existingReaction) {
        if (existingReaction.reaction_type === type) {
          action = 'delete';
        } else {
          action = 'update';
        }
      }

      // Perform the appropriate action
      if (action === 'delete') {
        await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUserId);
      } else if (action === 'update') {
        await supabase
          .from('post_reactions')
          .update({ reaction_type: type })
          .eq('post_id', postId)
          .eq('user_id', currentUserId);
      } else {
        await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: currentUserId,
            reaction_type: type
          });
      }

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
        if (action !== 'delete' && postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau j\'aime',
            `${userEmail} a aimé votre publication`
          );
        }
      } else {
        onDislike();
        if (action !== 'delete' && postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau je n\'aime pas',
            `${userEmail} n'a pas aimé votre publication`
          );
        }
      }

      toast({
        title: action === 'delete' ? "Réaction supprimée" : "Réaction ajoutée",
        description: action === 'delete' ? 
          "Votre réaction a été supprimée" : 
          `Vous avez ${type === 'like' ? 'aimé' : 'pas aimé'} cette publication`,
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
