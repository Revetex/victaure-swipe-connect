
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

  return (
    <div className="flex gap-2 items-center py-2">
      <div className="flex items-center gap-2">
        <ReactionButton
          icon={ThumbsUp}
          count={likes}
          isActive={userReaction === 'like'}
          onClick={() => handleReaction('like')}
          activeClassName="bg-primary/10 hover:bg-primary/20 text-primary"
        />
        <ReactionButton
          icon={ThumbsDown}
          count={dislikes}
          isActive={userReaction === 'dislike'}
          onClick={() => handleReaction('dislike')}
          activeClassName="bg-destructive/10 hover:bg-destructive/20 text-destructive"
        />
      </div>

      <div className="flex items-center gap-2">
        <ReactionButton
          icon={MessageSquare}
          count={commentCount}
          isActive={isExpanded}
          onClick={onToggleComments}
          activeClassName="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
        />
      </div>
    </div>
  );
}
