
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PostListProps {
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

export function PostList({ onPostDeleted, onPostUpdated }: PostListProps) {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (error) {
    console.error("Error fetching posts:", error);
    toast.error("Erreur lors du chargement des publications");
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-muted rounded-lg h-32" />
        <div className="animate-pulse bg-muted rounded-lg h-32" />
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <motion.div 
        className="text-center py-12 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Pas encore de publications
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {posts.map((post) => (
        <div 
          key={post.id}
          className="bg-card rounded-lg p-4 shadow-sm border"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div>
              <div className="font-medium">
                {post.profiles?.full_name || "Utilisateur"}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <p className="text-sm">{post.content}</p>
        </div>
      ))}
    </motion.div>
  );
}
