import { CommentManager } from "../comments/CommentManager";
import { PostActions as PostInteractions } from "../PostActions";
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
      avatar_url: string;
    };
  }[];
  onReaction: (type: 'like' | 'dislike') => void;
  onCommentAdded: () => void;
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
  onCommentAdded
}: PostContentProps) => {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  return (
    <>
      <p className="text-foreground mb-4 whitespace-pre-wrap">{content}</p>

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
    </>
  );
};