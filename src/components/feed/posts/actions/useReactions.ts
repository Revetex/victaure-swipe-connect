
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "./useNotifications";
import { useQueryClient } from "@tanstack/react-query";

interface UseReactionsProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  userReaction?: 'like' | 'dislike';
}

export const useReactions = ({
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  userReaction,
}: UseReactionsProps) => {
  const { toast } = useToast();
  const { createNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

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
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUserId);

        if (error) throw error;
      } else {
        // Sinon, on ajoute/met à jour la réaction
        const { error } = await supabase
          .from('post_reactions')
          .upsert({
            post_id: postId,
            user_id: currentUserId,
            reaction_type: type
          }, {
            onConflict: 'post_id,user_id'
          });

        if (error) throw error;

        // Envoyer une notification seulement pour les likes sur les posts d'autres utilisateurs
        if (type === 'like' && postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau j\'aime',
            `${userEmail} a aimé votre publication`,
            'like'
          );
        }
      }

      // Rafraîchir les données
      await queryClient.invalidateQueries({ queryKey: ["posts"] });

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
