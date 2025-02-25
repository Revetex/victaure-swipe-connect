import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { usePostOperations } from "./usePostOperations";
import { PostSkeleton } from "./PostSkeleton";
import { EmptyPostState } from "./EmptyPostState";
import { DeletePostDialog } from "./DeletePostDialog";
import { PostFilters } from "./sections/PostFilters";
import { PostGrid } from "./sections/PostGrid";
import { usePostsQuery } from "./hooks/usePostsQuery";
interface PostListProps {
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}
export function PostList({
  onPostDeleted,
  onPostUpdated
}: PostListProps) {
  const {
    user
  } = useAuth();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const {
    handleDelete,
    handleHide,
    handleUpdate
  } = usePostOperations();
  const {
    data: posts,
    isLoading
  } = usePostsQuery({
    filter,
    sortBy,
    sortOrder,
    userId: user?.id
  });
  const filteredPosts = posts?.filter(post => post.content.toLowerCase().includes(searchTerm.toLowerCase()));
  if (isLoading) return <PostSkeleton />;
  if (!posts?.length) return <EmptyPostState />;
  return <main className="relative w-full max-w-3xl mx-auto space-y-4 px-2 sm:px-4 py-6">
      {/* Coins colorés */}
      
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#1B2A4A] to-transparent opacity-20 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#1B2A4A] to-transparent opacity-20 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#64B5D9] to-transparent opacity-20 rounded-br-xl" />
      
      {/* Contenu */}
      <div className="relative z-10 backdrop-blur-sm">
        <PostFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} filter={filter} onFilterChange={setFilter} sortBy={sortBy} onSortByChange={setSortBy} sortOrder={sortOrder} onSortOrderChange={setSortOrder} />

        <PostGrid posts={filteredPosts || []} currentUserId={user?.id} userEmail={user?.email} onDelete={postId => setPostToDelete(postId)} onHide={handleHide} onUpdate={handleUpdate} />

        <DeletePostDialog isOpen={!!postToDelete} onClose={() => setPostToDelete(null)} onConfirm={() => {
        if (postToDelete && user?.id) {
          handleDelete(postToDelete, user.id);
          setPostToDelete(null);
        }
      }} />
      </div>
    </main>;
}