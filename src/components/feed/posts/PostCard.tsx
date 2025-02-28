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
  return <div className="overflow-hidden text-[#F2EBE4] bg-emerald-950">
      <div className="p-4 space-y-4 rounded-none bg-emerald-950">
        <PostCardHeader profile={post.profiles} created_at={post.created_at} privacy_level={post.privacy_level} isOwnPost={isOwnPost} isEditing={isEditing} onEdit={() => setIsEditing(true)} onSave={handleSaveEdit} onCancel={handleCancelEdit} onDelete={onDelete} />

        <PostCardContent content={post.content} images={post.images} isEditing={isEditing} editContent={editContent} onEditContentChange={setEditContent} />
      </div>

      <div className="px-4 py-2 bg-gray-50/50 dark:bg-gray-800/50">
        <PostActions likes={post.likes} dislikes={post.dislikes} commentCount={post.comments?.length || 0} userReaction={post.reactions?.find(r => r.user_id === currentUserId)?.reaction_type} isExpanded={showComments} postId={post.id} postAuthorId={post.user_id} currentUserId={currentUserId} userEmail={userEmail} onToggleComments={handleToggleComments} onReaction={onReaction} />
      </div>

      {showComments && post.comments && <div className="border-t border-gray-200 dark:border-gray-700">
          <CommentManager postId={post.id} postAuthorId={post.user_id} currentUserId={currentUserId} userEmail={userEmail} comments={post.comments} onCommentAdded={onCommentAdded} />
        </div>}
    </div>;
}