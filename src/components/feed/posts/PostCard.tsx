
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PostHeader } from "../PostHeader";
import { Post } from "@/types/posts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PostImageGrid } from "./PostImageGrid";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveEdit}
                    className="text-primary hover:text-primary/90 hover:bg-primary/10"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancelEdit}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:text-primary/90 hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 mt-4">
          {isEditing ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px] resize-none"
              placeholder="Que voulez-vous partager ?"
            />
          ) : (
            post.content && (
              <div className="text-sm text-foreground/80 whitespace-pre-wrap">
                {post.content}
              </div>
            )
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
