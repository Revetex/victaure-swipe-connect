import { Card } from "@/components/ui/card";
import { UserCircle, ThumbsUp, ThumbsDown, MessageSquare, Trash2, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  content: string;
  images: string[];
  likes: number;
  dislikes: number;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
  reactions?: {
    reaction_type: string;
  }[];
  comments?: {
    id: string;
    content: string;
    created_at: string;
    profiles: {
      full_name: string;
    };
  }[];
}

export function PostList() {
  const { toast } = useToast();
  const { session } = useSession({ required: false });
  const queryClient = useQueryClient();

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
          ),
          reactions:post_reactions(reaction_type),
          comments:post_comments(
            id,
            content,
            created_at,
            profiles(full_name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    }
  });

  const handleReaction = async (postId: string, type: 'like' | 'dislike') => {
    const { error } = await supabase
      .from('post_reactions')
      .upsert(
        { 
          post_id: postId, 
          user_id: session?.user.id,
          reaction_type: type 
        },
        { onConflict: 'post_id,user_id' }
      );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive"
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  };

  const handleDelete = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
    }
  };

  const handleHide = async (postId: string) => {
    const { error } = await supabase
      .from('hidden_posts')
      .insert({
        post_id: postId,
        user_id: session?.user.id
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to hide post",
        variant: "destructive"
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Post hidden successfully"
      });
    }
  };

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
            <div className="flex-1">
              <h3 className="font-medium">{post.profiles.full_name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {post.user_id === session?.user.id ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleHide(post.id)}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-foreground mb-4">{post.content}</p>
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex gap-2"
              onClick={() => handleReaction(post.id, 'like')}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex gap-2"
              onClick={() => handleReaction(post.id, 'dislike')}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{post.dislikes || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments?.length || 0}</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}