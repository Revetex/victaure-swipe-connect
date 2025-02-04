import { CommentManager } from "../comments/CommentManager";
import { PostActions as PostInteractions } from "../PostActions";
import { Button } from "@/components/ui/button";
import { EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

interface PostContentProps {
  content: string;
  postId: string;
  currentUserId?: string;
  userEmail?: string;
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  comments?: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  }[];
  onReaction: (type: 'like' | 'dislike') => void;
  onCommentAdded: () => void;
  onDelete?: () => void;
  onHide?: () => void;
  postUserId: string;
}

export const PostContent = ({
  content,
  postId,
  currentUserId,
  userEmail,
  likes,
  dislikes,
  commentCount,
  userReaction,
  comments,
  onReaction,
  onCommentAdded,
  onDelete,
  onHide,
  postUserId
}: PostContentProps) => {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {postUserId === currentUserId ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onHide}
            className="h-8 w-8 hover:bg-destructive/10"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-foreground mb-4 mt-4 whitespace-pre-wrap">{content}</p>

      <PostInteractions
        likes={likes}
        dislikes={dislikes}
        commentCount={commentCount}
        userReaction={userReaction}
        isExpanded={isCommentsExpanded}
        onLike={() => onReaction('like')}
        onDislike={() => onReaction('dislike')}
        onToggleComments={() => setIsCommentsExpanded(!isCommentsExpanded)}
      />

      {isCommentsExpanded && comments && (
        <CommentManager
          postId={postId}
          postAuthorId={currentUserId}
          currentUserId={currentUserId}
          userEmail={userEmail}
          comments={comments}
          onCommentAdded={onCommentAdded}
        />
      )}
    </div>
  );
};