
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function PostList() {
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
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse bg-muted rounded-lg h-32" />
        ))}
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Pas encore de publications
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article 
          key={post.id}
          className="bg-card rounded-lg p-4 shadow-sm border"
        >
          <header className="flex items-center space-x-3 mb-4">
            {post.profiles?.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={post.profiles.full_name || "Avatar"}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted" />
            )}
            <div>
              <h3 className="font-medium">
                {post.profiles?.full_name || "Utilisateur"}
              </h3>
              <time className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </time>
            </div>
          </header>
          <p className="text-sm leading-relaxed">{post.content}</p>
        </article>
      ))}
    </div>
  );
}
