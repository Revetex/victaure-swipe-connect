
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState, memo } from "react";
import { PostCard } from "./PostCard";
import { usePostOperations } from "./usePostOperations";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { PostSkeleton } from "./PostSkeleton";
import { EmptyPostState } from "./EmptyPostState";
import { DeletePostDialog } from "./DeletePostDialog";

interface PostListProps {
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

const MemoizedPostCard = memo(PostCard);

export function PostList({ onPostDeleted, onPostUpdated }: PostListProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { handleReaction, handleDelete, handleHide, handleUpdate } = usePostOperations();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
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
          comments:post_comments(
            id,
            content,
            created_at,
            user_id,
            profiles(
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
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const handleDeletePost = async (postId: string, userId: string | undefined) => {
    if (userId !== user?.id) {
      toast.error("Vous ne pouvez supprimer que vos propres publications");
      return;
    }
    
    try {
      await handleDelete(postId, userId);
      onPostDeleted();
      toast.success("Publication supprimée avec succès");
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("Erreur lors de la suppression de la publication");
    }
  };

  const handleUpdatePost = async (postId: string, content: string) => {
    try {
      await handleUpdate(postId, content);
      onPostUpdated();
      toast.success("Publication mise à jour avec succès");
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error("Erreur lors de la mise à jour de la publication");
    }
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (!posts?.length) {
    return <EmptyPostState />;
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <MemoizedPostCard
              post={post}
              currentUserId={user?.id}
              userEmail={user?.email}
              onDelete={() => post.user_id === user?.id && setPostToDelete(post.id)}
              onHide={(postId) => handleHide(postId, user?.id)}
              onReaction={(postId, type) => handleReaction(postId, user?.id, type)}
              onCommentAdded={() => queryClient.invalidateQueries({ queryKey: ["posts"] })}
              onUpdate={handleUpdatePost}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <DeletePostDialog 
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => postToDelete && handleDeletePost(postToDelete, user?.id)}
      />
    </div>
  );
}
