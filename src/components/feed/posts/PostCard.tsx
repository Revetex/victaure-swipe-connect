import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PostContent } from "./PostContent";
import { PostHeader } from "../PostHeader";
import { PostComments } from "../PostComments";
import { Post } from "@/types/posts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      <Card className={cn(
        "border shadow-sm transition-all duration-200 p-4",
        "hover:shadow-md hover:border-primary/20"
      )}>
        <PostHeader 
          profile={post.profiles}
          created_at={post.created_at}
          privacy_level={post.privacy_level}
        />
        <PostContent 
          content={post.content}
          images={post.images}
          currentUserId={currentUserId}
          userEmail={userEmail}
          likes={post.likes}
          dislikes={post.dislikes}
          commentCount={post.comments?.length || 0}
          userReaction={post.reactions?.find(r => r.user_id === currentUserId)?.reaction_type}
          comments={post.comments}
          onReaction={(type) => onReaction?.(post.id, type)}
          onCommentAdded={onCommentAdded!}
          onDelete={onDelete}
          onHide={() => onHide?.(post.id)}
          postUserId={post.user_id}
        />
        {showComments && post.comments && (
          <PostComments 
            comments={post.comments}
            currentUserId={currentUserId}
            onDeleteComment={() => onCommentAdded?.()}
          />
        )}
      </Card>
    </motion.div>
  );
}