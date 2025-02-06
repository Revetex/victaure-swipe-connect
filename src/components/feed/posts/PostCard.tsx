import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PostHeader } from "../PostHeader";
import { Post } from "@/types/posts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PostActions } from "../PostActions";
import { CommentManager } from "../comments/CommentManager";
import { PostImageGrid } from "./PostImageGrid";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  userEmail?: string;
  onDelete?: () => void;
  onHide?: (postId: string) => void;
  onReaction?: (postId: string, type: 'like' | 'dislike') => void;
  onCommentAdded?: () => void;
}

export function PostCard({ 
  post, 
  currentUserId,
  userEmail,
  onDelete, 
  onHide,
  onReaction,
  onCommentAdded 
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const isMobile = useIsMobile();

  const handleReaction = (type: 'like' | 'dislike') => {
    onReaction?.(post.id, type);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const postWithDefaultAvatar = {
    ...post,
    profiles: {
      ...post.profiles,
      avatar_url: post.profiles.avatar_url || '/user-icon.svg'
    }
  };

  const commentsWithDefaultAvatar = post.comments?.map(comment => ({
    ...comment,
    profiles: {
      ...comment.profiles,
      avatar_url: comment.profiles.avatar_url || '/user-icon.svg'
    }
  })) || [];

  const isOwnPost = currentUserId === post.user_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      <Card className={cn(
        "border shadow-sm transition-all duration-200",
        "p-4 sm:p-5 hover:shadow-md hover:border-primary/20",
        isMobile ? "active:scale-[0.995] touch-none" : "hover:scale-[1.002]",
        "touch-pan-y"
      )}>
        <div className="flex justify-between items-start gap-4">
          <PostHeader 
            profile={postWithDefaultAvatar.profiles}
            created_at={post.created_at}
            privacy_level={post.privacy_level}
          />
          
          {isOwnPost && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 -mt-1 -mr-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4 mt-4">
          {post.content && (
            <div className="text-sm text-foreground/80 whitespace-pre-wrap">
              {post.content}
            </div>
          )}
          
          {post.images && post.images.length > 0 && (
            <PostImageGrid images={post.images} />
          )}

          <PostActions
            likes={post.likes}
            dislikes={post.dislikes}
            commentCount={post.comments?.length || 0}
            userReaction={post.reactions?.find(r => r.user_id === currentUserId)?.reaction_type}
            isExpanded={showComments}
            postId={post.id}
            postAuthorId={post.user_id}
            currentUserId={currentUserId}
            userEmail={userEmail}
            onLike={() => handleReaction('like')}
            onDislike={() => handleReaction('dislike')}
            onToggleComments={handleToggleComments}
          />

          {showComments && (
            <CommentManager
              postId={post.id}
              postAuthorId={post.user_id}
              currentUserId={currentUserId}
              userEmail={userEmail}
              comments={commentsWithDefaultAvatar}
              onCommentAdded={onCommentAdded}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}