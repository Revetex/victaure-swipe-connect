
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
    <div className="relative min-h-screen bg-[#1A1F2C]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#1A1F2C] via-[#1B2A4A] to-[#1A1F2C]" />
      
      <div className="absolute inset-0" 
           style={{
             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
             backgroundSize: '15px 15px'
           }} 
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto space-y-6 px-4 sm:px-6 py-6">
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
          className="bg-[#1B2A4A]/30 backdrop-blur-sm border border-[#64B5D9]/10 rounded-lg overflow-hidden"
        >
          <PostList 
            onPostDeleted={invalidatePosts}
            onPostUpdated={invalidatePosts}
          />
        </motion.div>
      </div>
    </div>
  );
}
