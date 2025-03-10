
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { usePostOperations } from "./posts/usePostOperations";
import { usePostsQuery } from "./posts/hooks/usePostsQuery";
import { PostSkeleton } from "./posts/PostSkeleton";
import { EmptyPostState } from "./posts/EmptyPostState";
import { DeletePostDialog } from "./posts/DeletePostDialog";
import { PostGrid } from "./posts/sections/PostGrid";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PostListProps {
  searchTerm?: string;
  filter: string;
  sortBy: 'date' | 'likes' | 'comments';
  sortOrder: 'asc' | 'desc';
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

export function PostList({
  searchTerm = '',
  filter,
  sortBy,
  sortOrder,
  onPostDeleted,
  onPostUpdated
}: PostListProps) {
  const { user } = useAuth();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const {
    handleDelete,
    handleHide,
    handleUpdate
  } = usePostOperations();
  const loaderRef = useRef(null);
  const inView = useInView(loaderRef);
  
  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = usePostsQuery({
    filter,
    sortBy,
    sortOrder,
    userId: user?.id,
    page,
    limit: 10,
    searchTerm
  });
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    console.error("Error loading posts:", error);
    toast.error("Unable to load posts");
    return null;
  }

  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  if (isLoading) return <PostSkeleton />;
  if (allPosts.length === 0) return <EmptyPostState />;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PostGrid 
        posts={allPosts} 
        currentUserId={user?.id} 
        userEmail={user?.email} 
        onDelete={postId => setPostToDelete(postId)} 
        onHide={handleHide} 
        onUpdate={(postId, content) => {
          handleUpdate(postId, content);
          onPostUpdated();
        }} 
      />

      {/* Loader for infinite scroll */}
      {hasNextPage && (
        <div ref={loaderRef} className="flex justify-center p-4">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <div className="h-6 w-6" />
          )}
        </div>
      )}

      <DeletePostDialog 
        isOpen={!!postToDelete} 
        onClose={() => setPostToDelete(null)} 
        onConfirm={() => {
          if (postToDelete && user?.id) {
            handleDelete(postToDelete, user.id);
            setPostToDelete(null);
            onPostDeleted();
          }
        }} 
      />
    </motion.div>
  );
}
