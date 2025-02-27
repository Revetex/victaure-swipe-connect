
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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
    <div className="relative">
      {/* Barre fixe en haut */}
      <div className="fixed top-16 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto max-w-5xl px-4 py-2 space-y-2">
          {!isExpanded ? (
            <Button
              onClick={() => setIsExpanded(true)}
              variant="ghost"
              className="w-full bg-white/5 hover:bg-white/10 text-white/80 h-10 justify-start px-4"
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

      {/* Espace pour compenser la hauteur fixe */}
      <div className="h-[120px]" />

      {/* Liste des posts avec infinite scroll */}
      <div className="container mx-auto max-w-5xl px-4 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
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
      </div>
    </div>
  );
}
