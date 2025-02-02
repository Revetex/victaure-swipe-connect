import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, UserCircle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

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

export function Feed() {
  const [newPost, setNewPost] = useState("");
  const { profile } = useProfile();

  const { data: posts, refetch } = useQuery({
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

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const { error } = await supabase
        .from("posts")
        .insert([
          {
            content: newPost,
            user_id: profile?.id
          }
        ]);

      if (error) throw error;

      setNewPost("");
      refetch();
      toast.success("Publication créée avec succès");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création de la publication");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Partagez quelque chose..."
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" size="icon">
              <Image className="h-4 w-4" />
            </Button>
            <Button onClick={handleCreatePost}>
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </div>
        </div>
      </Card>

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
    </div>
  );
}
