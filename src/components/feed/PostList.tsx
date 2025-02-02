import { Card } from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  content: string;
  images: string[];
  likes: number;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export function PostList() {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    }
  });

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              {post.profiles.avatar_url ? (
                <img
                  src={post.profiles.avatar_url}
                  alt={post.profiles.full_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{post.profiles.full_name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="text-foreground">{post.content}</p>
        </Card>
      ))}
    </div>
  );
}