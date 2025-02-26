
import { useQueryClient } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { PostFilters } from "./posts/sections/PostFilters";
import { useState, useRef } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Publication states
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "connections">("public");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Scroll animations
  const { scrollY } = useScroll({ container: scrollRef });
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.95]);

  // Data mutations
  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  // Background pattern
  const BackgroundPattern = () => (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#1A1F2C] via-[#1B2A4A] to-[#1A1F2C]" />
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '15px 15px'
        }} 
      />
    </>
  );

  // Fixed filters section
  const FilterSection = () => (
    <div className="fixed top-16 left-0 right-0 z-50">
      <div className="w-full max-w-3xl mx-auto px-4 py-2 sm:px-0">
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
  );

  // Content section
  const ContentSection = () => (
    <div className="w-full max-w-3xl mx-auto px-4 space-y-6 sm:px-0">
      <motion.div
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="origin-top transform-gpu"
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
          onClose={() => setIsExpanded(false)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1B2A4A]/30 backdrop-blur-sm border border-[#64B5D9]/10 rounded-xl overflow-hidden shadow-lg"
      >
        <PostList
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </motion.div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] overflow-hidden">
      <BackgroundPattern />
      <FilterSection />
      
      <div 
        ref={scrollRef} 
        className="relative z-10 h-full overflow-y-auto pt-32 scrollbar-thin scrollbar-thumb-[#64B5D9]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#64B5D9]/20"
        style={{ scrollbarGutter: 'stable', overscrollBehavior: 'contain' }}
      >
        <ContentSection />
      </div>
    </div>
  );
}
