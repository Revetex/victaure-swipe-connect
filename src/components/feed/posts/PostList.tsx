
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
  const { user } = useAuth();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { handleDelete, handleHide, handleUpdate } = usePostOperations();

  const { data: posts, isLoading } = usePostsQuery({
    filter,
    sortBy,
    sortOrder,
    userId: user?.id
  });

  const filteredPosts = posts?.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <PostSkeleton />;
  if (!posts?.length) return <EmptyPostState />;

  return (
    <main className="relative w-full max-w-3xl mx-auto space-y-6 px-2 sm:px-4 py-6">
      <div className="relative z-10 space-y-6">
        <PostFilters 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          filter={filter} 
          onFilterChange={setFilter}
          sortBy={sortBy} 
          onSortByChange={setSortBy}
          sortOrder={sortOrder} 
          onSortOrderChange={setSortOrder}
        />

        <PostGrid 
          posts={filteredPosts || []} 
          currentUserId={user?.id}
          userEmail={user?.email}
          onDelete={postId => setPostToDelete(postId)}
          onHide={handleHide}
          onUpdate={handleUpdate}
        />

        <DeletePostDialog 
          isOpen={!!postToDelete}
          onClose={() => setPostToDelete(null)}
          onConfirm={() => {
            if (postToDelete && user?.id) {
              handleDelete(postToDelete, user.id);
              setPostToDelete(null);
            }
          }}
        />
      </div>
    </main>
  );
}
