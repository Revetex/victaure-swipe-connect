
import { motion, AnimatePresence } from "framer-motion";
import { PostCard } from "../PostCard";
import type { Post } from "@/types/posts";

interface PostGridProps {
  posts: Post[];
  currentUserId?: string;
  userEmail?: string;
  onDelete: (postId: string) => void;
  onHide: (postId: string, userId?: string) => void;
  onUpdate: (postId: string, content: string) => void;
}

export function PostGrid({
  posts,
  currentUserId,
  userEmail,
  onDelete,
  onHide,
  onUpdate
}: PostGridProps) {
  return (
    <AnimatePresence mode="popLayout">
      {posts.map((post) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          layout
        >
          <PostCard
            post={post}
            currentUserId={currentUserId}
            userEmail={userEmail}
            onDelete={() => post.user_id === currentUserId && onDelete(post.id)}
            onHide={(postId) => onHide(postId, currentUserId)}
            onUpdate={onUpdate}
          />
        </motion.article>
      ))}
    </AnimatePresence>
  );
}
