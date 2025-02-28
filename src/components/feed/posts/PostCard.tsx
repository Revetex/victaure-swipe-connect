
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
  onShare?: () => void;
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
  onCommentAdded,
  onShare
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const isMobile = useIsMobile();

  const handleToggleComments = () => setShowComments(!showComments);
  
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-panel mb-4 hover-lift"
    >
      <div className="space-y-4">
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
      </div>

      <div className="border-t border-[#9b87f5]/10 p-2">
        <PostActions 
          post={post}
          currentUserId={currentUserId}
          onReaction={onReaction}
          onToggleComments={handleToggleComments}
          onShare={onShare}
          onHide={onHide}
          showComments={showComments}
        />
      </div>

      {showComments && post.comments && (
        <div className="border-t border-[#9b87f5]/10 bg-[#1A1F2C]/60">
          <CommentManager 
            postId={post.id}
            postAuthorId={post.user_id}
            currentUserId={currentUserId}
            userEmail={userEmail}
            comments={post.comments}
            onCommentAdded={onCommentAdded}
          />
        </div>
      )}
    </motion.div>
  );
}
