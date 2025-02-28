
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
  searchTerm?: string;
}

interface PostsResponse {
  posts: Post[];
  nextPage: number | undefined;
}

export function usePostsQuery({ 
  filter, 
  sortBy, 
  sortOrder, 
  userId, 
  limit = 10, 
  searchTerm = '' 
}: UsePostsQueryProps) {
  return useInfiniteQuery<PostsResponse, Error>({
    queryKey: ["posts", filter, sortBy, sortOrder, userId, searchTerm],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number) * limit;
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

      // Si une recherche est spécifiée, utiliser la recherche full-text
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.textSearch('searchable_content', searchTerm.trim(), {
          type: 'websearch',
          config: 'french'
        });
      }

      // Appliquer les filtres
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
          } else {
            // Si aucun post n'est liké, retourner un tableau vide
            return { posts: [], nextPage: undefined };
          }
          break;
        }
        case "connections": {
          if (!userId) break;
          
          const { data: friends } = await supabase
            .from("friendships")
            .select("friend_id")
            .eq("user_id", userId)
            .eq("status", "confirmed");
            
          const { data: friendsReverse } = await supabase
            .from("friendships")
            .select("user_id")
            .eq("friend_id", userId)
            .eq("status", "confirmed");
            
          const friendIds = [
            ...(friends?.map(f => f.friend_id) || []),
            ...(friendsReverse?.map(f => f.user_id) || [])
          ];
          
          if (friendIds.length) {
            query = query.in("user_id", friendIds);
          } else {
            return { posts: [], nextPage: undefined };
          }
          break;
        }
      }

      // Appliquer les tris
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
        console.error("Erreur lors de la récupération des posts:", error);
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
        nextPage: data?.length === limit ? (pageParam as number) + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
