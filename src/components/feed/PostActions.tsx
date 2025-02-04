import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  isExpanded: boolean;
  onLike: () => void;
  onDislike: () => void;
  onToggleComments: () => void;
}

export const PostActions = ({
  likes,
  dislikes,
  commentCount,
  userReaction,
  isExpanded,
  onLike,
  onDislike,
  onToggleComments,
}: PostActionsProps) => {
  return (
    <div className="flex gap-4 items-center mb-4">
      <Button
        variant={userReaction === 'like' ? 'default' : 'ghost'}
        size="sm"
        className="flex gap-2"
        onClick={onLike}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{likes}</span>
      </Button>
      <Button
        variant={userReaction === 'dislike' ? 'default' : 'ghost'}
        size="sm"
        className="flex gap-2"
        onClick={onDislike}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{dislikes}</span>
      </Button>
      <Button
        variant={isExpanded ? 'default' : 'ghost'}
        size="sm"
        className="flex gap-2"
        onClick={onToggleComments}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{commentCount}</span>
      </Button>
    </div>
  );
};