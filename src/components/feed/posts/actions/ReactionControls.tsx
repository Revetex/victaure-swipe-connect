
import { Heart, ThumbsDown } from "lucide-react";
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
        icon={Heart}
        count={likes || 0}
        isActive={userReaction === 'like'}
        onClick={() => handleReaction('like')}
        label="J'aime"
        activeClassName="text-red-500 hover:bg-red-500/10"
      />

      <ReactionButton
        icon={ThumbsDown}
        count={dislikes || 0}
        isActive={userReaction === 'dislike'} 
        onClick={() => handleReaction('dislike')}
        label="Je n'aime pas"
        activeClassName="text-blue-500 hover:bg-blue-500/10"
      />
    </div>
  );
}
