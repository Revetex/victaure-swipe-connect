
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { PostCard } from "./PostCard";
import { usePostOperations } from "./usePostOperations";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { PostSkeleton } from "./PostSkeleton";
import { EmptyPostState } from "./EmptyPostState";
import { DeletePostDialog } from "./DeletePostDialog";
import { Filter, SearchIcon } from "lucide-react";
import type { Post } from "@/types/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PostListProps {
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

export function PostList({ onPostDeleted, onPostUpdated }: PostListProps) {
  const { user } = useAuth();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'comments'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { handleDelete, handleHide, handleUpdate } = usePostOperations();

  const { data: posts, isLoading } = useQuery({
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
        query.eq("user_id", user?.id);
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

  const filteredPosts = posts?.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (!posts?.length) {
    return <EmptyPostState />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="sticky top-[73px] z-30 bg-background/80 backdrop-blur-lg border-b border-border/40 shadow-sm mb-4">
        <div className="p-4 space-y-4">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          
          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Select
              value={filter}
              onValueChange={setFilter}
            >
              <SelectTrigger className="min-w-[140px] bg-background/50">
                <SelectValue placeholder="Filtrer par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les posts</SelectItem>
                <SelectItem value="liked">Mes likes</SelectItem>
                <SelectItem value="following">Abonnements</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: 'date' | 'likes' | 'comments') => setSortBy(value)}
            >
              <SelectTrigger className="min-w-[140px] bg-background/50">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="comments">Commentaires</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger className="min-w-[140px] bg-background/50">
                <SelectValue placeholder="Ordre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Croissant</SelectItem>
                <SelectItem value="desc">Décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4">
        <AnimatePresence mode="popLayout">
          {filteredPosts?.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <PostCard
                post={post}
                currentUserId={user?.id}
                userEmail={user?.email}
                onDelete={() => post.user_id === user?.id && setPostToDelete(post.id)}
                onHide={(postId) => handleHide(postId, user?.id)}
                onUpdate={(postId, content) => handleUpdate(postId, content)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <DeletePostDialog 
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => {
          if (postToDelete && user?.id) {
            handleDelete(postToDelete, user.id);
            setPostToDelete(null);
          }
        }}
      />
    </div>
  );
}
