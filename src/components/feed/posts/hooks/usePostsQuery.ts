
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/types/posts";

interface UsePostsQueryProps {
  filter: string;
  sortBy: 'date' | 'likes' | 'comments';
  sortOrder: 'asc' | 'desc';
  userId?: string;
}

export function usePostsQuery({ filter, sortBy, sortOrder, userId }: UsePostsQueryProps) {
  return useQuery({
    queryKey: ["posts", filter, sortBy, sortOrder, userId],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles (
            id,
            full_name,
            avatar_url
          ),
          reactions:post_reactions (
            id,
            user_id,
            reaction_type
          ),
          comments:post_comments (
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
        `);

      // Appliquer les filtres
      switch (filter) {
        case "my":
          query = query.eq("user_id", userId);
          break;
        case "liked":
          query = query.in("id", supabase
            .from("post_reactions")
            .select("post_id")
            .eq("user_id", userId)
            .eq("reaction_type", "like")
          );
          break;
        case "saved":
          query = query.in("id", supabase
            .from("saved_posts")
            .select("post_id")
            .eq("user_id", userId)
          );
          break;
      }

      // Appliquer le tri
      switch (sortBy) {
        case "date":
          query = query.order("created_at", { ascending: sortOrder === "asc" });
          break;
        case "likes":
          query = query.order("likes", { ascending: sortOrder === "asc" });
          break;
        case "comments":
          // Pour le tri par commentaires, nous devons trier après avoir récupéré les données
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      // Si le tri est par commentaires, nous devons trier manuellement
      if (sortBy === "comments") {
        return data.sort((a: Post, b: Post) => {
          const aCount = a.comments?.length || 0;
          const bCount = b.comments?.length || 0;
          return sortOrder === "asc" ? aCount - bCount : bCount - aCount;
        });
      }

      return data;
    }
  });
}
