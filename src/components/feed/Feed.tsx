
import { motion } from "framer-motion";
import { CreatePost } from "./posts/CreatePost";
import { PostList } from "./posts/PostList";

export function Feed() {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <CreatePost />
      <PostList />
    </motion.div>
  );
}
