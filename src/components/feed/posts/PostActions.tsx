
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useReactions } from "./actions/useReactions";
import { ReactionButton } from "./actions/ReactionButton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: 'like' | 'dislike';
  isExpanded: boolean;
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  onToggleComments: () => void;
  onReaction?: (postId: string, type: 'like' | 'dislike') => void;
}

interface PostPayload {
  id: string;
  likes: number;
  dislikes: number;
  user_id: string;
  content: string;
  created_at: string;
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
  onToggleComments,
  onReaction
}: PostActionsProps) {
  const { handleReaction } = useReactions({
    postId,
    postAuthorId,
    currentUserId,
    userEmail,
    userReaction
  });

  useEffect(() => {
    const channel = supabase
      .channel('post-reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${postId}`
        },
        (payload: RealtimePostgresChangesPayload<PostPayload>) => {
          if (payload.new && onReaction) {
            const oldLikes = (payload.old as PostPayload)?.likes ?? 0;
            const oldDislikes = (payload.old as PostPayload)?.dislikes ?? 0;
            const newLikes = (payload.new as PostPayload).likes;
            const newDislikes = (payload.new as PostPayload).dislikes;
            
            if (newLikes > oldLikes) {
              onReaction(postId, 'like');
            } else if (newDislikes > oldDislikes) {
              onReaction(postId, 'dislike');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, onReaction]);

  const handleReactionClick = (type: 'like' | 'dislike') => {
    handleReaction(type);
    onReaction?.(postId, type);
  };

  const calculateReactionPercentage = () => {
    const total = likes + dislikes;
    if (total === 0) return { likes: 50, dislikes: 50 }; // Si pas de réactions, on affiche 50/50
    
    const likePercentage = Math.round((likes / total) * 100);
    const dislikePercentage = 100 - likePercentage;
    
    return { likes: likePercentage, dislikes: dislikePercentage };
  };

  const percentages = calculateReactionPercentage();

  return (
    <div className="flex gap-2 items-center py-2">
      <div className="flex items-center gap-2">
        <ReactionButton
          icon={ThumbsUp}
          count={percentages.likes}
          suffix="%"
          isActive={userReaction === 'like'}
          onClick={() => handleReactionClick('like')}
          activeClassName="bg-green-500 hover:bg-green-600 text-white shadow-lg"
        />
        <ReactionButton
          icon={ThumbsDown}
          count={percentages.dislikes}
          suffix="%"
          isActive={userReaction === 'dislike'}
          onClick={() => handleReactionClick('dislike')}
          activeClassName="bg-red-500 hover:bg-red-600 text-white shadow-lg"
        />
      </div>

      <div className="flex items-center gap-2">
        <ReactionButton
          icon={MessageSquare}
          count={commentCount}
          isActive={isExpanded}
          onClick={onToggleComments}
          activeClassName="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        />
      </div>
    </div>
  );
}
