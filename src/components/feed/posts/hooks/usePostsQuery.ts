
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
    queryKey: ["posts", filter, sortBy, sortOrder],
    queryFn: async () => {
      const query = supabase
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

      if (filter === "liked") {
        query.eq("user_id", userId);
      }

      switch (sortBy) {
        case 'date':
          query.order('created_at', { ascending: sortOrder === 'asc' });
          break;
        case 'likes':
          query.order('likes', { ascending: sortOrder === 'asc' });
          break;
        case 'comments':
          const { data, error } = await query;
          if (error) throw error;
          return data.map(post => ({
            ...post,
            privacy_level: post.privacy_level as "public" | "connections",
            reactions: post.reactions?.map(reaction => ({
              ...reaction,
              reaction_type: reaction.reaction_type as "like" | "dislike"
            }))
          })).sort((a: Post, b: Post) => {
            const aComments = a.comments?.length || 0;
            const bComments = b.comments?.length || 0;
            return sortOrder === 'asc' ? aComments - bComments : bComments - aComments;
          });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(post => ({
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
}
