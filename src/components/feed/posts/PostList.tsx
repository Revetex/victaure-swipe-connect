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
import { Filter, SearchIcon, SendHorizonal } from "lucide-react";
import type { Post } from "@/types/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedPostToShare, setSelectedPostToShare] = useState<Post | null>(null);
  const [recipientId, setRecipientId] = useState("");
  const { handleDelete, handleHide, handleUpdate } = usePostOperations();

  const { data: posts, isLoading } = useQuery<Post[]>({
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

      // Appliquer le filtre
      if (filter === "liked") {
        query.eq("user_id", user?.id);
      }

      // Appliquer le tri
      switch (sortBy) {
        case 'date':
          query.order('created_at', { ascending: sortOrder === 'asc' });
          break;
        case 'likes':
          query.order('likes', { ascending: sortOrder === 'asc' });
          break;
        case 'comments':
          // Trier par nombre de commentaires
          const { data, error } = await query;
          if (error) throw error;
          return data.sort((a, b) => {
            const aComments = a.comments?.length || 0;
            const bComments = b.comments?.length || 0;
            return sortOrder === 'asc' ? aComments - bComments : bComments - aComments;
          });
      }

      const { data, error } = await query;
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

  const handleSharePost = async (post: Post) => {
    try {
      const { data: { user: { id: senderId } } } = await supabase.auth.getUser();
      
      // Créer un nouveau message avec le contenu du post
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: senderId,
          receiver_id: recipientId,
          content: `${post.content}\n\nPartagé depuis le feed`,
          post_id: post.id // Référence au post original
        });

      if (error) throw error;

      toast.success("Post partagé avec succès");
      setShowShareDialog(false);
      setSelectedPostToShare(null);
      setRecipientId("");
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error("Erreur lors du partage du post");
    }
  };

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
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans les posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filter}
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Croissant</SelectItem>
              <SelectItem value="desc">Décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredPosts?.map((post) => {
          const postWithDefaults: Post = {
            ...post,
            likes: post.likes || 0,
            dislikes: post.dislikes || 0,
            comments: post.comments || [],
            reactions: post.reactions || []
          };

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <PostCard
                post={postWithDefaults}
                currentUserId={user?.id}
                userEmail={user?.email}
                onDelete={() => post.user_id === user?.id && setPostToDelete(post.id)}
                onHide={(postId) => handleHide(postId, user?.id)}
                onUpdate={(postId, content) => handleUpdate(postId, content)}
                onShare={() => {
                  setSelectedPostToShare(post);
                  setShowShareDialog(true);
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Dialogue de suppression */}
      <DeletePostDialog 
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => postToDelete && handleDelete(postToDelete, user?.id)}
      />

      {/* Dialogue de partage */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partager le post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="ID du destinataire"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => selectedPostToShare && handleSharePost(selectedPostToShare)}
                disabled={!recipientId}
              >
                <SendHorizonal className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
