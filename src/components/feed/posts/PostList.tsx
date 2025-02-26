import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { usePostOperations } from "./usePostOperations";
import { usePostsQuery } from "./hooks/usePostsQuery";
import { PostSkeleton } from "./PostSkeleton";
import { EmptyPostState } from "./EmptyPostState";
import { DeletePostDialog } from "./DeletePostDialog";
import { PostGrid } from "./sections/PostGrid";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
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
    </motion.div>
  );
}
