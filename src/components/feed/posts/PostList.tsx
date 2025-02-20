
import { motion } from "framer-motion";

interface PostListProps {
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

export function PostList({ onPostDeleted, onPostUpdated }: PostListProps) {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center text-muted-foreground">
        Pas encore de publications
      </div>
    </motion.div>
  );
}
