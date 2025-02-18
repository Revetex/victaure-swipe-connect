
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useReactions } from "./actions/useReactions";
import { ReactionButton } from "./actions/ReactionButton";

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

  const handleReactionClick = (type: 'like' | 'dislike') => {
    handleReaction(type);
    onReaction?.(postId, type);
  };

  return (
    <div className="flex gap-2 items-center py-2">
      <ReactionButton
        icon={ThumbsUp}
        count={likes || 0}
        isActive={userReaction === 'like'}
        onClick={() => handleReactionClick('like')}
        activeClassName="bg-green-500 hover:bg-green-600 text-white shadow-lg"
      />

      <ReactionButton
        icon={ThumbsDown}
        count={dislikes || 0}
        isActive={userReaction === 'dislike'}
        onClick={() => handleReactionClick('dislike')}
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
