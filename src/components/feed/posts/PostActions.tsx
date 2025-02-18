
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useReactions } from "./actions/useReactions";
import { ReactionButton } from "./actions/ReactionButton";
import { Badge } from "@/components/ui/badge";

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

  const total = likes + dislikes;
  
  const calculateReactionPercentage = () => {
    if (total === 0) return { likes: 0, dislikes: 0 };
    
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
        {total > 0 && (
          <Badge variant="secondary" className="text-xs">
            {total} votes
          </Badge>
        )}
      </div>
    </div>
  );
}
