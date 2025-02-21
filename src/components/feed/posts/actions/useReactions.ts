
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
      // Mise à jour optimiste des données
      queryClient.setQueriesData(['posts'], (oldData: any) => {
        return oldData?.map((post: any) => {
          if (post.id === postId) {
            const isRemoving = userReaction === type;
            return {
              ...post,
              [type + 's']: post[type + 's'] + (isRemoving ? -1 : 1),
              ...(userReaction && userReaction !== type && {
                [userReaction + 's']: post[userReaction + 's'] - 1
              }),
              user_reaction: isRemoving ? null : type
            };
          }
          return post;
        });
      });

      // Appel à la fonction RPC handle_post_reaction
      const { error } = await supabase.rpc('handle_post_reaction', {
        p_post_id: postId,
        p_user_id: currentUserId,
        p_reaction_type: type
      });

      if (error) throw error;

      // Si c'est un like et pas une suppression de réaction, envoyer une notification
      if (type === 'like' && userReaction !== type && postAuthorId !== currentUserId) {
        await createNotification(
          postAuthorId,
          'Nouveau j\'aime',
          `${userEmail} a aimé votre publication`,
          'like'
        );
      }

    } catch (error) {
      console.error('Error handling reaction:', error);
      // Annuler la mise à jour optimiste en cas d'erreur
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
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
