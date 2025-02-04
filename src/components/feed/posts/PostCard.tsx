import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PostContent } from "./PostContent";
import { PostHeader } from "../PostHeader";
import { Post } from "@/types/posts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PostActions } from "../PostActions";
import { CommentManager } from "../comments/CommentManager";

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
        "touch-pan-y"
      )}>
        <PostHeader 
          profile={post.profiles}
          created_at={post.created_at}
          privacy_level={post.privacy_level}
        />

        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {post.content}
          </div>
          
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
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
              comments={post.comments}
              onCommentAdded={onCommentAdded}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
}