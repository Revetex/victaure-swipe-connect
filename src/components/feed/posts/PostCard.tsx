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

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  onHide?: () => void;
}

export function PostCard({ post, onDelete, onHide }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const { handleDelete, handleHide } = usePostOperations();

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
            onClick={() => handleHide(post.id)}
            className="h-8 w-8 hover:bg-destructive/10"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
          {post.user_id === user?.id && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(post.id)}
              className="h-8 w-8 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <PostHeader post={post} />
        <PostContent post={post} />
        <PostActions
          likes={post.likes}
          dislikes={post.dislikes}
          commentCount={post.comments?.length || 0}
          userReaction={post.userReaction}
          isExpanded={showComments}
          onLike={() => handleReaction(post.id, 'like')}
          onDislike={() => handleReaction(post.id, 'dislike')}
          onToggleComments={() => setShowComments(!showComments)}
        />
        {showComments && <PostComments postId={post.id} />}
      </Card>
    </motion.div>
  );
}