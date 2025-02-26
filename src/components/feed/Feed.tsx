
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
  const {
    scrollY
  } = useScroll({
    container: scrollRef
  });
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.95]);

  const invalidatePosts = () => {
    queryClient.invalidateQueries({
      queryKey: ["posts"]
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <CreatePostForm
          newPost={newPost}
          setNewPost={setNewPost}
          privacy={privacy}
          setPrivacy={setPrivacy}
          attachments={attachments}
          setAttachments={setAttachments}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          onPostCreated={invalidatePosts}
        />
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
        <PostList
          onPostDeleted={invalidatePosts}
          onPostUpdated={invalidatePosts}
        />
      </div>
    </div>
  );
}
