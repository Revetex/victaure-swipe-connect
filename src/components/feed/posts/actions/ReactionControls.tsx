
import { Heart, HeartCrack } from "lucide-react";
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
    <div className="flex gap-3">
      <ReactionButton
        icon={Heart}
        count={likes || 0}
        isActive={userReaction === 'like'}
        onClick={() => handleReaction('like')}
        activeClassName="bg-gradient-to-tr from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
      />

      <ReactionButton
        icon={HeartCrack}
        count={dislikes || 0}
        isActive={userReaction === 'dislike'}
        onClick={() => handleReaction('dislike')}
        activeClassName="bg-gradient-to-tr from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg"
      />
    </div>
  );
}
