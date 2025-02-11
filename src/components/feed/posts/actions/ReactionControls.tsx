
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useReactions } from "./useReactions";
import { ReactionButton } from "./ReactionButton";

interface ReactionControlsProps {
  likes: number;
  dislikes: number;
  userReaction?: string;
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  onLike: () => void;
  onDislike: () => void;
}

export function ReactionControls({
  likes,
  dislikes,
  userReaction,
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  onLike,
  onDislike,
}: ReactionControlsProps) {
  const { handleReaction } = useReactions({
    postId,
    postAuthorId,
    currentUserId,
    userEmail,
    onLike,
    onDislike
  });

  return (
    <div className="flex gap-2">
      <ReactionButton
        icon={ThumbsUp}
        count={likes || 0}
        isActive={userReaction === 'like'}
        onClick={() => handleReaction('like')}
        activeClassName="text-primary"
      />

      <ReactionButton
        icon={ThumbsDown}
        count={dislikes || 0}
        isActive={userReaction === 'dislike'}
        onClick={() => handleReaction('dislike')}
        activeClassName="text-destructive"
      />
    </div>
  );
}
