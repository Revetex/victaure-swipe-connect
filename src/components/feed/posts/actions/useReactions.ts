
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "./useNotifications";

interface UseReactionsProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  userReaction?: string;
  onLike: () => void;
  onDislike: () => void;
}

export const useReactions = ({
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  userReaction,
  onLike,
  onDislike,
}: UseReactionsProps) => {
  const { toast } = useToast();
  const { createNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!currentUserId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour réagir",
        variant: "destructive"
      });
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Si la même réaction existe, on la supprime
      if (userReaction === type) {
        await supabase.from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUserId);
          
        type === 'like' ? onDislike() : onLike();
      } else {
        // Sinon, on ajoute/met à jour la réaction
        const { error } = await supabase.rpc('handle_post_reaction', {
          p_post_id: postId,
          p_user_id: currentUserId,
          p_reaction_type: type
        });

        if (error) throw error;

        if (type === 'like' && postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau j\'aime',
            `${userEmail} a aimé votre publication`,
            'like'
          );
        }

        type === 'like' ? onLike() : onDislike();
      }

    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réaction",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleReaction };
};
