
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Share } from "lucide-react";
import { cn } from "@/lib/utils";

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
  onToggleComments,
  onReaction
}: PostActionsProps): ReactNode {
  return (
    <div className="flex justify-between items-center w-full py-1">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-2 text-muted-foreground hover:text-primary",
            userReaction === "like" && "text-primary bg-primary/10"
          )}
          onClick={() => onReaction(postId, "like")}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          {likes > 0 && <span>{likes}</span>}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-2 text-muted-foreground hover:text-destructive",
            userReaction === "dislike" && "text-destructive bg-destructive/10"
          )}
          onClick={() => onReaction(postId, "dislike")}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          {dislikes > 0 && <span>{dislikes}</span>}
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "px-2 text-muted-foreground",
            isExpanded && "bg-muted/30 text-foreground"
          )}
          onClick={onToggleComments}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {commentCount > 0 && <span>{commentCount}</span>}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="px-2 text-muted-foreground"
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
