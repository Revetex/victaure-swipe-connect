
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { useState } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "connections">("public");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-4 sm:px-6 py-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-20 z-10 space-y-4"
      >
        <CreatePostForm 
          newPost={newPost}
          onPostChange={setNewPost}
          privacy={privacy}
          onPrivacyChange={setPrivacy}
          attachments={attachments}
          isUploading={isUploading}
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
      >
        <PostList 
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </motion.div>
    </div>
  );
}
