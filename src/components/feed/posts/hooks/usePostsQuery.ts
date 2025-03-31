
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Post } from '../types';

interface UsePostsQueryProps {
  filter: string;
  sortBy: 'date' | 'likes' | 'comments';
  sortOrder: 'asc' | 'desc';
  userId?: string;
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export function usePostsQuery({
  filter,
  sortBy,
  sortOrder,
  userId,
  limit = 10,
  searchTerm = ''
}: UsePostsQueryProps) {

  const fetchPosts = async ({ pageParam = 1 }) => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          user_id,
          comments:post_comments(
            id,
            content,
            created_at,
            user_id,
            post_id,
            profiles:user_id(id, full_name, avatar_url)
          ),
          reactions:post_reactions(
            id,
            reaction_type,
            user_id
          ),
          profiles:user_id(
            id,
            full_name,
            avatar_url,
            role
          )
        `, { count: 'exact' });

      // Apply filter
      if (filter === 'mine' && userId) {
        query = query.eq('user_id', userId);
      } else if (filter === 'connections' && userId) {
        // Logic for connections filter - would need a jointure with friendships
        // For now, just show all posts to avoid blank page
      }

      // Apply search term
      if (searchTerm) {
        query = query.textSearch('searchable_content', searchTerm);
      }

      // Apply sorting
      if (sortBy === 'date') {
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'likes') {
        query = query.order('likes', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'comments') {
        // Not ideal but we'll order by created_at for now
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      }

      // Apply pagination
      const from = (pageParam - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Process the data to ensure it conforms to Post type
      const processedPosts = data?.map((post: any) => ({
        ...post,
        comments: (post.comments || []).map((comment: any) => ({
          ...comment,
          post_id: comment.post_id || post.id // Ensure post_id is present
        })),
        user: post.profiles,
        reactions: (post.reactions || []),
        // Ensure privacy_level is one of the allowed values
        privacy_level: (post.privacy_level === 'public' || post.privacy_level === 'connections') 
          ? post.privacy_level 
          : 'public'
      })) as Post[];

      return {
        posts: processedPosts || [],
        nextPage: data?.length === limit ? pageParam + 1 : null,
        totalCount: count || 0
      };
    } catch (err) {
      console.error('Error fetching posts:', err);
      throw err;
    }
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts', filter, sortBy, sortOrder, userId, searchTerm],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1
  });

  return {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
}
