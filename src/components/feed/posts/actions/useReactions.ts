
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
      // Récupérer d'abord l'état actuel du post
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('likes, dislikes')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;
      if (!post) throw new Error('Post not found');

      // Si la même réaction existe, on la supprime
      if (userReaction === type) {
        // Supprimer la réaction
        const { error: deleteError } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUserId);

        if (deleteError) throw deleteError;

        // Mettre à jour le compteur dans la table posts
        const { error: updateError } = await supabase
          .from('posts')
          .update({
            [type === 'like' ? 'likes' : 'dislikes']: Math.max(0, (type === 'like' ? post.likes : post.dislikes) - 1)
          })
          .eq('id', postId);

        if (updateError) throw updateError;
      } else {
        // Si une réaction différente existe, on la met à jour
        if (userReaction) {
          // Mettre à jour la réaction existante
          const { error: updateReactionError } = await supabase
            .from('post_reactions')
            .update({ reaction_type: type })
            .eq('post_id', postId)
            .eq('user_id', currentUserId);

          if (updateReactionError) throw updateReactionError;

          // Mettre à jour les compteurs
          const { error: updateCountsError } = await supabase
            .from('posts')
            .update({
              [type === 'like' ? 'likes' : 'dislikes']: (type === 'like' ? post.likes : post.dislikes) + 1,
              [type === 'like' ? 'dislikes' : 'likes']: Math.max(0, (type === 'like' ? post.dislikes : post.likes) - 1)
            })
            .eq('id', postId);

          if (updateCountsError) throw updateCountsError;
        } else {
          // Créer une nouvelle réaction
          const { error: insertError } = await supabase
            .from('post_reactions')
            .insert({
              post_id: postId,
              user_id: currentUserId,
              reaction_type: type
            });

          if (insertError) throw insertError;

          // Incrémenter le compteur
          const { error: updateError } = await supabase
            .from('posts')
            .update({
              [type === 'like' ? 'likes' : 'dislikes']: (type === 'like' ? post.likes : post.dislikes) + 1
            })
            .eq('id', postId);

          if (updateError) throw updateError;
        }

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
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

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
