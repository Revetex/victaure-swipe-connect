
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

  const handleReactionClick = async (type: 'like' | 'dislike') => {
    // Mise à jour optimiste immédiate
    if (type === 'like') {
      onLike();
    } else {
      onDislike();
    }
    
    // Appel API en arrière-plan
    await handleReaction(type);
  };

  return (
    <div className="flex gap-2">
      <ReactionButton
        icon={ThumbsUp}
        count={likes || 0}
        isActive={userReaction === 'like'}
        onClick={() => handleReactionClick('like')}
        activeClassName="text-primary"
      />

      <ReactionButton
        icon={ThumbsDown}
        count={dislikes || 0}
        isActive={userReaction === 'dislike'}
        onClick={() => handleReactionClick('dislike')}
        activeClassName="text-destructive"
      />
    </div>
  );
}
