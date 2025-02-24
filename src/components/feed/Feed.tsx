
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";

export function Feed() {
  const queryClient = useQueryClient();

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto space-y-6 px-4 sm:px-6 mt-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <CreatePostForm 
          newPost=""
          onPostChange={() => {}}
          privacy="public"
          onPrivacyChange={() => {}}
          attachments={[]}
          isUploading={false}
          onFileChange={() => {}}
          onRemoveFile={() => {}}
          onCreatePost={invalidatePosts}
          onClose={() => {}}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-lg overflow-hidden"
      >
        <PostList 
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </motion.div>
    </motion.div>
  );
}
