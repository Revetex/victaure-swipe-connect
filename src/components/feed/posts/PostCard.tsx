import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Post } from "@/types/posts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PostActions } from "./PostActions";
import { CommentManager } from "@/components/feed/comments/CommentManager";
import { PostCardHeader } from "./card/PostCardHeader";
import { PostCardContent } from "./card/PostCardContent";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  userEmail?: string;
  onDelete?: () => void;
  onHide?: (postId: string) => void;
  onReaction?: (postId: string, type: 'like' | 'dislike') => void;
  onCommentAdded?: () => void;
  onUpdate?: (postId: string, content: string) => void;
}

export function PostCard({ 
  post, 
  currentUserId,
  userEmail,
  onDelete, 
  onHide,
  onReaction,
  onCommentAdded,
  onUpdate
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const isMobile = useIsMobile();

  const handleReaction = (type: 'like' | 'dislike') => {
    onReaction?.(post.id, type);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== post.content) {
      onUpdate?.(post.id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

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
        "p-3 sm:p-4 hover:shadow-md hover:border-primary/20",
        isMobile ? "active:scale-[0.995] touch-none" : "hover:scale-[1.002]",
        "touch-pan-y overscroll-y-contain"
      )}>
        <PostCardHeader 
          profile={post.profiles}
          created_at={post.created_at}
          privacy_level={post.privacy_level}
          isOwnPost={isOwnPost}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onDelete={onDelete!}
        />

        <PostCardContent 
          content={post.content}
          images={post.images}
          isEditing={isEditing}
          editContent={editContent}
          onEditContentChange={setEditContent}
        />

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

        {showComments && post.comments && (
          <CommentManager
            postId={post.id}
            postAuthorId={post.user_id}
            currentUserId={currentUserId}
            userEmail={userEmail}
            comments={post.comments}
            onCommentAdded={onCommentAdded}
          />
        )}
      </Card>
    </motion.div>
  );
}
