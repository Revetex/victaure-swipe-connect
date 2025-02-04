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

export function PostList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { handleReaction, handleDelete, handleHide } = usePostOperations();

  const { data: posts } = useQuery({
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

      // Transform the data to ensure privacy_level is of the correct type
      return data?.map(post => ({
        ...post,
        privacy_level: post.privacy_level as "public" | "connections"
      }));
    }
  });

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={user?.id}
          userEmail={user?.email}
          onDelete={() => setPostToDelete(post.id)}
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
            <AlertDialogAction onClick={() => postToDelete && handleDelete(postToDelete, user?.id)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}