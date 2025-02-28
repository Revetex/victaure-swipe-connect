
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart, ThumbsDown, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction: 'like' | 'dislike' | null;
  isExpanded: boolean;
  postId: string;
  postAuthorId: string;
  currentUserId: string;
  userEmail: string;
  onToggleComments: () => void;
  onReaction: (postId: string, type: 'like' | 'dislike') => void;
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
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 px-3 hover:bg-background/10",
            userReaction === 'like' && "text-blue-400"
          )}
          onClick={() => onReaction(postId, 'like')}
        >
          <Heart className="h-4 w-4" />
          <span className="text-xs font-medium">{likes}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 px-3 hover:bg-background/10",
            userReaction === 'dislike' && "text-red-400"
          )}
          onClick={() => onReaction(postId, 'dislike')}
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="text-xs font-medium">{dislikes}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1 px-3 hover:bg-background/10",
            isExpanded && "text-primary"
          )}
          onClick={onToggleComments}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs font-medium">{commentCount}</span>
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 px-3 hover:bg-background/10"
      >
        <Share className="h-4 w-4" />
        <span className="text-xs font-medium">Partager</span>
      </Button>
    </div>
  );
}
