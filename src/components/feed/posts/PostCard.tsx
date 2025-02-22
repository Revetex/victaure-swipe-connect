
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

export interface PostCardProps {
  post: Post;
  currentUserId?: string;
  userEmail?: string;
  onDelete?: () => void;
  onHide?: (postId: string) => void;
  onUpdate?: (postId: string, content: string) => void;
  onReaction?: (postId: string, type: 'like' | 'dislike') => void;
  onCommentAdded?: () => void;
}

export function PostCard({ 
  post, 
  currentUserId,
  userEmail,
  onDelete, 
  onHide,
  onUpdate,
  onReaction,
  onCommentAdded
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const isMobile = useIsMobile();

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
        "bg-[#1B2A4A]/80 backdrop-blur-sm border border-[#64B5D9]/10",
        "p-3 sm:p-4 hover:border-[#64B5D9]/20 shadow-[0_0_0_1px_rgba(100,181,217,0.1),0_4px_12px_rgba(0,0,0,0.3)]",
        "transition-all duration-300",
        isMobile ? "active:scale-[0.995] touch-none" : "hover:scale-[1.002]",
        "text-[#F2EBE4]"
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
          onDelete={onDelete}
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
          onToggleComments={handleToggleComments}
          onReaction={onReaction}
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
