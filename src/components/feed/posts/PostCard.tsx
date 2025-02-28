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
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className="overflow-hidden rounded-lg bg-[#1A1F2C] border border-[#9b87f5]/10 shadow-sm mb-4 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <PostCardHeader profile={post.profiles} created_at={post.created_at} privacy_level={post.privacy_level} isOwnPost={isOwnPost} isEditing={isEditing} onEdit={() => setIsEditing(true)} onSave={handleSaveEdit} onCancel={handleCancelEdit} onDelete={onDelete} />

        <PostCardContent content={post.content} images={post.images} isEditing={isEditing} editContent={editContent} onEditContentChange={setEditContent} />
      </div>

      <div className="border-t border-[#9b87f5]/10 py-0 px-0">
        <PostActions likes={post.likes} dislikes={post.dislikes} commentCount={post.comments?.length || 0} userReaction={post.reactions?.find(r => r.user_id === currentUserId)?.reaction_type} isExpanded={showComments} postId={post.id} postAuthorId={post.user_id} currentUserId={currentUserId} userEmail={userEmail} onToggleComments={handleToggleComments} onReaction={onReaction} />
      </div>

      {showComments && post.comments && <div className="border-t border-[#9b87f5]/10 bg-[#1A1F2C]/60">
          <CommentManager postId={post.id} postAuthorId={post.user_id} currentUserId={currentUserId} userEmail={userEmail} comments={post.comments} onCommentAdded={onCommentAdded} />
        </div>}
    </motion.div>;
}