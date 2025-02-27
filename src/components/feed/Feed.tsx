
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { PostFilters } from "./posts/sections/PostFilters";
import { useState } from "react";
import { PostAttachment, PostPrivacyLevel } from "./posts/types";
import { Button } from "../ui/button";
import { PenLine } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export function Feed() {
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacyLevel>("public");
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExpanded, setIsExpanded] = useState(false);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handlePostChange = (value: string) => setNewPost(value);
  const handlePrivacyChange = (value: PostPrivacyLevel) => setPrivacy(value);
  const handleCreatePost = () => {
    invalidatePosts();
    setIsExpanded(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Header fixe avec effet glassmorphique */}
      <div className="fixed top-16 left-0 right-0 z-50">
        <div className="bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
          <div className="container mx-auto max-w-4xl px-4 py-3 space-y-3">
            {!isExpanded ? (
              <Button
                onClick={() => setIsExpanded(true)}
                variant="ghost"
                className="w-full bg-white/5 hover:bg-white/10 text-white/80 h-12 justify-start px-4 rounded-xl transition-all duration-200"
              >
                <PenLine className="h-4 w-4 mr-2" />
                Partagez quelque chose...
              </Button>
            ) : (
              <CreatePostForm
                newPost={newPost}
                onPostChange={handlePostChange}
                privacy={privacy}
                onPrivacyChange={handlePrivacyChange}
                attachments={attachments}
                isUploading={isUploading}
                onCreatePost={handleCreatePost}
                onClose={() => setIsExpanded(false)}
                isExpanded={isExpanded}
              />
            )}
            
            <PostFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filter={filter}
              onFilterChange={setFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              onCreatePost={() => setIsExpanded(true)}
            />
          </div>
        </div>
      </div>

      {/* Espace pour compenser la hauteur du header fixe */}
      <div className="h-[140px]" />

      {/* Container principal avec le feed */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 pb-8"
        >
          <PostList
            searchTerm={searchTerm}
            filter={filter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPostDeleted={invalidatePosts}
            onPostUpdated={invalidatePosts}
          />
        </motion.div>
      </main>
    </div>
  );
}
