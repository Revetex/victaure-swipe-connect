
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Post, Comment } from "@/types/posts";

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
            post_id,
            profiles(
              id,
              full_name,
              avatar_url
            )
          )
        `, { count: 'exact' })
        .range(from, to);

      // If a search is specified, use full-text search
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.textSearch('searchable_content', searchTerm.trim(), {
          type: 'websearch',
          config: 'french'
        });
      }

      // Apply filters
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
            // If no posts are liked, return an empty array
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

      // Apply sorting
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
        console.error("Error fetching posts:", error);
        throw error;
      }

      // Transform database response to match the Post type
      const transformedData = data?.map(post => {
        // Make sure comments have post_id
        const transformedComments = post.comments?.map(comment => ({
          ...comment,
          post_id: comment.post_id || post.id // Ensure post_id is set
        })) as Comment[] | undefined;

        return {
          ...post,
          privacy_level: post.privacy_level as "public" | "connections",
          reactions: post.reactions?.map(reaction => ({
            ...reaction,
            reaction_type: reaction.reaction_type as "like" | "dislike"
          })),
          comments: transformedComments
        } as Post;
      }) || [];

      // Manual sorting for comments if needed
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
