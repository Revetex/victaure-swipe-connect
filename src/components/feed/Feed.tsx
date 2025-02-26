
import { useQueryClient } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { PostFilters } from "./posts/sections/PostFilters";
import { useState, useRef } from "react";

export function Feed() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form and filter states
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "connections">("public");
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExpanded, setIsExpanded] = useState(false);

  // Scroll animations
  const { scrollY } = useScroll({ container: scrollRef });
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.95]);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#1A1F2C] via-[#1B2A4A] to-[#1A1F2C]" />
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '15px 15px'
        }} 
      />

      {/* Filters */}
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

      {/* Content */}
      <div 
        ref={scrollRef} 
        className="relative z-10 h-full overflow-y-auto pt-32 scrollbar-thin scrollbar-thumb-[#64B5D9]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#64B5D9]/20"
        style={{ scrollbarGutter: 'stable', overscrollBehavior: 'contain' }}
      >
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

          <PostList
            onPostDeleted={invalidatePosts}
            onPostUpdated={invalidatePosts}
          />
        </div>
      </div>
    </div>
  );
}
