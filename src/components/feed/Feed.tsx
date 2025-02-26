
import { useQueryClient } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { CreatePostForm } from "./posts/create/CreatePostForm";
import { PostList } from "./posts/PostList";
import { PostFilters } from "./posts/sections/PostFilters";
import { useState, useRef } from "react";
import { PostAttachment, PostPrivacyLevel } from "./posts/types";

export function Feed() {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form and filter states
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacyLevel>("public");
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExpanded, setIsExpanded] = useState(false);

  // Scroll animations
  const { scrollY } = useScroll({
    container: scrollRef
  });
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.95]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Gérer le changement de fichiers
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = () => {
    // Logique de création de post
    invalidatePosts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <CreatePostForm
          newPost={newPost}
          onPostChange={handlePostChange}
          privacy={privacy}
          onPrivacyChange={handlePrivacyChange}
          attachments={attachments}
          isUploading={isUploading}
          onFileChange={handleFileChange}
          onRemoveFile={handleRemoveFile}
          onCreatePost={handleCreatePost}
          onClose={() => setIsExpanded(false)}
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
