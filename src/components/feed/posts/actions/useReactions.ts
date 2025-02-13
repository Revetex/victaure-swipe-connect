
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

      // Send notification only if it's a like and not the user's own post
      if (type === 'like' && postAuthorId !== currentUserId) {
        await createNotification(
          postAuthorId,
          'Nouveau j\'aime',
          `${userEmail} a aimé votre publication`,
          'like'
        );
      }

      // Update UI
      if (type === 'like') {
        onLike();
      } else {
        onDislike();
      }

      toast({
        title: "Réaction mise à jour",
        description: `Votre réaction a été enregistrée`,
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
