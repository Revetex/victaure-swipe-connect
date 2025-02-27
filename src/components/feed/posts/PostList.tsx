
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { usePostOperations } from "./usePostOperations";
import { usePostsQuery } from "./hooks/usePostsQuery";
import { PostSkeleton } from "./PostSkeleton";
import { EmptyPostState } from "./EmptyPostState";
import { DeletePostDialog } from "./DeletePostDialog";
import { PostGrid } from "./sections/PostGrid";
import { motion, useScroll, useInView } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

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
  const { handleDelete, handleHide, handleUpdate } = usePostOperations();
  
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
    limit: 10
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    console.error("Erreur lors du chargement des posts:", error);
    toast.error("Impossible de charger les posts");
    return null;
  }

  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];
  const filteredPosts = allPosts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <PostSkeleton />;
  if (!filteredPosts.length) return <EmptyPostState />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PostGrid 
        posts={filteredPosts} 
        currentUserId={user?.id}
        userEmail={user?.email}
        onDelete={postId => setPostToDelete(postId)}
        onHide={handleHide}
        onUpdate={(postId, content) => {
          handleUpdate(postId, content);
          onPostUpdated();
        }}
      />

      {/* Loader pour l'infinite scroll */}
      <div ref={loaderRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        )}
      </div>

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
