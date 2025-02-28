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
  return <div className="grid gap-6 rounded-none bg-transparent">
      <AnimatePresence mode="popLayout">
        {posts.map(post => <motion.article key={post.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} transition={{
        duration: 0.2
      }} layout className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <PostCard post={post} currentUserId={currentUserId} userEmail={userEmail} onDelete={() => post.user_id === currentUserId && onDelete(post.id)} onHide={postId => onHide(postId, currentUserId)} onUpdate={onUpdate} />
          </motion.article>)}
      </AnimatePresence>
    </div>;
}