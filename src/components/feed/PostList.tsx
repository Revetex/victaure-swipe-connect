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
import { useState } from "react";
import { PostCard } from "./posts/PostCard";
import { usePostOperations } from "./posts/usePostOperations";
import { toast } from "sonner";

interface PostListProps {
  onPostDeleted: () => void;
}

export function PostList({ onPostDeleted }: PostListProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { handleReaction, handleDelete, handleHide } = usePostOperations();

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
        privacy_level: post.privacy_level as "public" | "connections"
      }));
    }
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
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("Erreur lors de la suppression de la publication");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={user?.id}
          userEmail={user?.email}
          onDelete={() => post.user_id === user?.id && setPostToDelete(post.id)}
          onHide={(postId) => handleHide(postId, user?.id)}
          onReaction={(postId, type) => handleReaction(postId, user?.id, type)}
          onCommentAdded={() => queryClient.invalidateQueries({ queryKey: ["posts"] })}
        />
      ))}

      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette publication ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. La publication sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => postToDelete && handleDeletePost(postToDelete, user?.id)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}