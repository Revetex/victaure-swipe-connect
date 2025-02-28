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
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
export function Feed() {
  const queryClient = useQueryClient();

  // États du formulaire et des filtres
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
    queryClient.invalidateQueries({
      queryKey: ["posts"]
    });
  };
  const handlePostChange = (value: string) => {
    setNewPost(value);
  };
  const handlePrivacyChange = (value: PostPrivacyLevel) => {
    setPrivacy(value);
  };
  const handleCreatePost = () => {
    invalidatePosts();
    setIsExpanded(false);
  };
  return <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container mx-auto px-4 py-8 space-y-6">
      <motion.div variants={itemVariants}>
        {!isExpanded ? <Button onClick={() => setIsExpanded(true)} variant="ghost" className="w-full justify-start border border-white/10 py-0 rounded-sm px-[8px] text-sm text-gray-50 font-extralight bg-gray-900 hover:bg-gray-800">
            <PenLine className="h-5 w-5 mr-2" />
            Partagez quelque chose...
          </Button> : <CreatePostForm newPost={newPost} onPostChange={handlePostChange} privacy={privacy} onPrivacyChange={handlePrivacyChange} attachments={attachments} isUploading={isUploading} onCreatePost={handleCreatePost} onClose={() => setIsExpanded(false)} isExpanded={isExpanded} />}
      </motion.div>

      <motion.div variants={itemVariants}>
        <PostFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} filter={filter} onFilterChange={setFilter} sortBy={sortBy} onSortByChange={setSortBy} sortOrder={sortOrder} onSortOrderChange={setSortOrder} onCreatePost={() => setIsExpanded(true)} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <PostList searchTerm={searchTerm} filter={filter} sortBy={sortBy} sortOrder={sortOrder} onPostDeleted={invalidatePosts} onPostUpdated={invalidatePosts} />
      </motion.div>
    </motion.div>;
}