import { Card } from "@/components/ui/card";
import { PostHeader } from "../PostHeader";
import { PostContent } from "../PostContent";
import { PostActions } from "../PostActions";
import { PostComments } from "../PostComments";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Post } from "@/types/posts";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  userEmail?: string;
  onDelete: () => void;
  onHide: (postId: string) => void;
  onReaction: (postId: string, type: 'like' | 'dislike') => void;
  onCommentAdded: () => void;
}

export function PostCard({
  post,
  currentUserId,
  userEmail,
  onDelete,
  onHide,
  onReaction,
  onCommentAdded,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userReaction = post.reactions?.find(
    (reaction) => reaction.user_id === currentUserId
  )?.reaction_type;

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!currentUserId) {
      toast.error("Vous devez être connecté pour réagir aux publications");
      return;
    }
    await onReaction(post.id, type);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      toast.success("Publication supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleHide = async () => {
    try {
      await onHide(post.id);
      toast.success("Publication masquée");
    } catch (error) {
      toast.error("Erreur lors du masquage");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="overflow-hidden">
        <div className="p-4 space-y-4">
          <PostHeader
            profile={post.profiles}
            created_at={post.created_at}
            privacy_level={post.privacy_level}
          />
          
          <PostContent
            content={post.content}
            images={post.images}
          />

          <PostActions
            likes={post.likes || 0}
            dislikes={post.dislikes || 0}
            commentCount={post.comments?.length || 0}
            userReaction={userReaction}
            isExpanded={showComments}
            isOwnPost={post.user_id === currentUserId}
            onLike={() => handleReaction('like')}
            onDislike={() => handleReaction('dislike')}
            onToggleComments={() => setShowComments(!showComments)}
            onHide={handleHide}
            onDelete={handleDelete}
          />

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <PostComments
                  comments={post.comments || []}
                  currentUserId={currentUserId}
                  onDeleteComment={() => {}}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}