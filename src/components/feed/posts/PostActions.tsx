
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ReactionButton } from "./actions/ReactionButton";

interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  isExpanded: boolean;
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  onLike: () => void;
  onDislike: () => void;
  onToggleComments: () => void;
}

export function PostActions({
  likes,
  dislikes,
  commentCount,
  userReaction,
  isExpanded,
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  onLike,
  onDislike,
  onToggleComments,
}: PostActionsProps) {
  const { toast } = useToast();

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

      if (type === 'like') {
        onLike();
        if (postAuthorId !== currentUserId) {
          await supabase
            .from('notifications')
            .insert({
              user_id: postAuthorId,
              title: "Nouveau j'aime",
              message: `${userEmail} a aimé votre publication`,
              type: 'like'
            });
        }
      } else {
        onDislike();
        if (postAuthorId !== currentUserId) {
          await supabase
            .from('notifications')
            .insert({
              user_id: postAuthorId,
              title: "Nouveau je n'aime pas",
              message: `${userEmail} n'a pas aimé votre publication`,
              type: 'dislike'
            });
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réaction",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2 items-center py-2">
      <ReactionButton
        icon={ThumbsUp}
        count={likes || 0}
        isActive={userReaction === 'like'}
        onClick={() => handleReaction('like')}
        activeClassName="bg-green-500 hover:bg-green-600 text-white shadow-lg"
      />

      <ReactionButton
        icon={ThumbsDown}
        count={dislikes || 0}
        isActive={userReaction === 'dislike'}
        onClick={() => handleReaction('dislike')}
        activeClassName="bg-red-500 hover:bg-red-600 text-white shadow-lg"
      />

      <ReactionButton
        icon={MessageSquare}
        count={commentCount}
        isActive={isExpanded}
        onClick={onToggleComments}
        activeClassName="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
      />
    </div>
  );
}
