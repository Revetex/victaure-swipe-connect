
import { useState } from "react";
import { Post } from "@/components/feed/posts/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PostActions } from "./PostActions";
import { CommentManager } from "@/components/feed/comments/CommentManager";
import { PostCardHeader } from "./card/PostCardHeader";
import { PostCardContent } from "./card/PostCardContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemeContext } from "@/components/ThemeProvider";

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
  const { themeStyle, isDark } = useThemeContext();

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "overflow-hidden rounded-xl",
        "backdrop-blur-sm shadow-md",
        "transition-all duration-300 hover:shadow-lg",
        isDark 
          ? "bg-black/30 border border-white/10 hover:border-white/20 text-white/90" 
          : "bg-white/10 border border-white/5 hover:border-white/10 text-slate-900",
        `theme-${themeStyle}`
      )}
    >
      <ScrollArea className="h-full max-h-[600px]">
        <div className="p-4 space-y-4">
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
      </ScrollArea>

      <div className={cn(
        "border-t",
        isDark ? "border-zinc-800/50 bg-black/10" : "border-white/10 bg-white/5"
      )}>
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
      </div>

      {showComments && post.comments && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "border-t",
            isDark ? "border-zinc-800/50" : "border-white/10"
          )}
        >
          <ScrollArea className="max-h-[300px]">
            <CommentManager 
              postId={post.id} 
              postAuthorId={post.user_id} 
              currentUserId={currentUserId} 
              userEmail={userEmail} 
              comments={post.comments}
              onCommentAdded={onCommentAdded}
            />
          </ScrollArea>
        </motion.div>
      )}
    </motion.div>
  );
}
