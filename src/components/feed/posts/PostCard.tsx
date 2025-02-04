import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PostContent } from "./PostContent";
import { PostHeader } from "../PostHeader";
import { PostActions } from "./PostActions";
import { PostComments } from "../PostComments";
import { Post } from "@/types/posts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EyeOff, Trash2 } from "lucide-react";
import { usePostOperations } from "./usePostOperations";
import { useAuth } from "@/hooks/useAuth";

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
  const { handleDelete, handleHide, handleReaction } = usePostOperations();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      <Card className={cn(
        "border shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-primary/20"
      )}>
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onHide?.(post.id)}
            className="h-8 w-8 hover:bg-destructive/10"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
          {post.user_id === currentUserId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <PostHeader 
          profile={post.profiles!}
          created_at={post.created_at}
          privacy_level={post.privacy_level}
        />
        <PostContent 
          content={post.content}
          postId={post.id}
          currentUserId={currentUserId}
          userEmail={userEmail}
          likes={post.likes}
          dislikes={post.dislikes}
          commentCount={post.comments?.length || 0}
          userReaction={post.reactions?.find(r => r.user_id === currentUserId)?.reaction_type}
          comments={post.comments}
          onReaction={(type) => onReaction?.(post.id, type)}
          onCommentAdded={onCommentAdded}
        />
        <PostActions
          currentUserId={currentUserId}
          postUserId={post.user_id}
          onDelete={onDelete}
          onHide={() => onHide?.(post.id)}
        />
        {showComments && (
          <PostComments 
            comments={post.comments || []}
            currentUserId={currentUserId}
            onDeleteComment={() => onCommentAdded?.()}
          />
        )}
      </Card>
    </motion.div>
  );
}