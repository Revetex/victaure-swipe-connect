
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState, memo, useCallback } from "react";
import { PostCard } from "./posts/PostCard";
import { usePostOperations } from "./posts/usePostOperations";
import { motion, AnimatePresence } from "framer-motion";
import { PostSkeleton } from "./posts/PostSkeleton";
import { EmptyPostState } from "./posts/EmptyPostState";
import { DeletePostDialog } from "./posts/DeletePostDialog";

interface PostListProps {
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

const MemoizedPostCard = memo(PostCard);

export function PostList({ onPostDeleted, onPostUpdated }: PostListProps) {
  const { user } = useAuth();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { handleReaction, handleDelete, handleHide, handleUpdate } = usePostOperations();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          created_at,
          user_id,
          privacy_level,
          images,
          likes,
          dislikes,
          profiles (
            id,
            full_name,
            avatar_url
          ),
          reactions:post_reactions(
            id,
            reaction_type,
            user_id
          ),
          comments:post_comments!left(
            id,
            content,
            created_at,
            user_id,
            profiles (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data?.map(post => ({
        ...post,
        privacy_level: post.privacy_level as "public" | "connections",
        reactions: post.reactions?.map(reaction => ({
          ...reaction,
          reaction_type: reaction.reaction_type as "like" | "dislike"
        }))
      }));
    },
    staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
    gcTime: 1000 * 60 * 10,   // Garbage collection après 10 minutes
  });

  const handleDeletePost = useCallback(async (postId: string) => {
    try {
      await handleDelete(postId, user?.id);
      setPostToDelete(null);
      onPostDeleted();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }, [handleDelete, user?.id, onPostDeleted]);

  const handleUpdatePost = useCallback(async (postId: string, content: string) => {
    try {
      await handleUpdate(postId, content);
      onPostUpdated();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }, [handleUpdate, onPostUpdated]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts?.length) {
    return <EmptyPostState />;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout" initial={false}>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            layout="position"
          >
            <MemoizedPostCard
              post={post}
              currentUserId={user?.id}
              userEmail={user?.email}
              onDelete={() => post.user_id === user?.id && setPostToDelete(post.id)}
              onHide={(postId) => handleHide(postId, user?.id)}
              onReaction={(postId, type) => handleReaction(postId, user?.id, type)}
              onUpdate={handleUpdatePost}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <DeletePostDialog 
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => postToDelete && handleDeletePost(postToDelete)}
      />
    </div>
  );
}
