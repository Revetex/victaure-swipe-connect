
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const { createNotification } = useNotifications();

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!currentUserId) {
      toast.error("Vous devez être connecté pour réagir aux publications");
      return;
    }

    try {
      const { error } = await supabase.rpc('handle_post_reaction', {
        p_post_id: postId,
        p_user_id: currentUserId,
        p_reaction_type: type
      });

      if (error) throw error;

      // Notification seulement pour les likes des autres utilisateurs
      if (type === 'like' && postAuthorId !== currentUserId) {
        await createNotification(
          postAuthorId,
          'Nouveau j\'aime',
          `${userEmail} a aimé votre publication`,
          'like'
        );
      }

      if (type === 'like') {
        onLike();
        toast.success("J'aime ajouté");
      } else {
        onDislike();
        toast.success("Je n'aime pas ajouté");
      }

    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error("Une erreur est survenue lors de la réaction");
    }
  };

  return { handleReaction };
};
