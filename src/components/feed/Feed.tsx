
import { useQueryClient } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { useState, useRef } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "connections">("public");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const { scrollY } = useScroll({
    container: scrollRef
  });

  const headerOpacity = useTransform(
    scrollY,
    [0, 100],
    [1, 0]
  );

  const headerScale = useTransform(
    scrollY,
    [0, 100],
    [1, 0.95]
  );

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="relative min-h-screen bg-[#1A1F2C] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#1A1F2C] via-[#1B2A4A] to-[#1A1F2C]" />
      
      <div className="absolute inset-0" 
           style={{
             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
             backgroundSize: '15px 15px'
           }} 
      />

      <div 
        ref={scrollRef}
        className="relative z-10 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-[#64B5D9]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#64B5D9]/20"
        style={{
          scrollbarGutter: 'stable',
          overscrollBehavior: 'contain',
        }}
      >
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <motion.div 
            style={{
              opacity: headerOpacity,
              scale: headerScale,
            }}
            className="sticky top-20 z-10 space-y-4 origin-top transform-gpu"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#1B2A4A]/40 backdrop-blur-md border border-[#64B5D9]/10 rounded-xl shadow-lg"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative space-y-4"
          >
            <div className="bg-[#1B2A4A]/30 backdrop-blur-sm border border-[#64B5D9]/10 rounded-xl overflow-hidden shadow-lg">
              <PostList 
                onPostDeleted={invalidatePosts}
                onPostUpdated={invalidatePosts}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
