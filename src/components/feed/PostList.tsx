
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { PostCard } from "./posts/PostCard";
import { usePostOperations } from "./posts/usePostOperations";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { PostSkeleton } from "./posts/PostSkeleton";
import { EmptyPostState } from "./posts/EmptyPostState";
import { DeletePostDialog } from "./posts/DeletePostDialog";
import type { Post } from "@/types/posts";

interface PostListProps {
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

export function PostList({ onPostDeleted, onPostUpdated }: PostListProps) {
  const { user } = useAuth();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { handleDelete, handleHide, handleUpdate, handleReaction } = usePostOperations();

  const { data: posts, isLoading, refetch } = useQuery<Post[]>({
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

  const handleReactionUpdate = async (postId: string, type: 'like' | 'dislike') => {
    try {
      await handleReaction(postId, user?.id, type);
      refetch(); // Rafraîchit immédiatement les données
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error("Erreur lors de la réaction");
    }
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (!posts?.length) {
    return <EmptyPostState />;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {posts.map((post) => {
          const postWithDefaults: Post = {
            ...post,
            likes: post.likes || 0,
            dislikes: post.dislikes || 0,
            comments: post.comments || [],
            reactions: post.reactions || []
          };

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <PostCard
                post={postWithDefaults}
                currentUserId={user?.id}
                userEmail={user?.email}
                onDelete={() => post.user_id === user?.id && setPostToDelete(post.id)}
                onHide={(postId) => handleHide(postId, user?.id)}
                onUpdate={handleUpdatePost}
                onReaction={handleReactionUpdate}
                onCommentAdded={refetch}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <DeletePostDialog 
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => postToDelete && handleDeletePost(postToDelete, user?.id)}
      />
    </div>
  );
}
