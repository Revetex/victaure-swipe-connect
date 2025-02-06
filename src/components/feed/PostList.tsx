
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, memo } from "react";
import { PostCard } from "./posts/PostCard";
import { usePostOperations } from "./posts/usePostOperations";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo } from "lucide-react";

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
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="bg-muted/50 rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  if (!posts?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-muted-foreground py-12"
      >
        <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Aucune publication</p>
        <p className="text-sm mt-2">
          Soyez le premier à partager quelque chose !
        </p>
      </motion.div>
    );
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

      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette publication ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. La publication sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => postToDelete && handleDeletePost(postToDelete, user?.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
