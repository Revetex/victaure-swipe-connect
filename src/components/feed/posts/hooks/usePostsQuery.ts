
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/types/posts";

interface UsePostsQueryProps {
  filter: string;
  sortBy: 'date' | 'likes' | 'comments';
  sortOrder: 'asc' | 'desc';
  userId?: string;
  page: number;
  limit: number;
}

export function usePostsQuery({ filter, sortBy, sortOrder, userId, limit = 10 }: UsePostsQueryProps) {
  return useInfiniteQuery({
    queryKey: ["posts", filter, sortBy, sortOrder, userId],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * limit;
      const to = from + limit - 1;

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
        `)
        .range(from, to);

      switch (filter) {
        case "my":
          query = query.eq("user_id", userId);
          break;
        case "liked": {
          const { data: likedPosts } = await supabase
            .from("post_reactions")
            .select("post_id")
            .eq("user_id", userId)
            .eq("reaction_type", "like");
          
          if (likedPosts?.length) {
            const likedPostIds = likedPosts.map(reaction => reaction.post_id);
            query = query.in("id", likedPostIds);
          }
          break;
        }
      }

      switch (sortBy) {
        case "date":
          query = query.order("created_at", { ascending: sortOrder === "asc" });
          break;
        case "likes":
          query = query.order("likes", { ascending: sortOrder === "asc" });
          break;
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const transformedData = data?.map(post => ({
        ...post,
        privacy_level: post.privacy_level as "public" | "connections",
        reactions: post.reactions?.map(reaction => ({
          ...reaction,
          reaction_type: reaction.reaction_type as "like" | "dislike"
        }))
      })) as Post[];

      // Tri manuel pour les commentaires si nécessaire
      const sortedData = sortBy === "comments" 
        ? transformedData.sort((a, b) => {
            const aCount = a.comments?.length || 0;
            const bCount = b.comments?.length || 0;
            return sortOrder === "asc" ? aCount - bCount : bCount - aCount;
          })
        : transformedData;

      return {
        posts: sortedData,
        nextPage: data?.length === limit ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
}
