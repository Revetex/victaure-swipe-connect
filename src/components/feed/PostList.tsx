import { Card } from "@/components/ui/card";
import { UserCircle, ThumbsUp, ThumbsDown, MessageSquare, Trash2, EyeOff, Globe, Lock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Post {
  id: string;
  content: string;
  images: string[];
  created_at: string;
  user_id: string;
  privacy_level: "public" | "connections";
  profiles: {
    full_name: string;
    avatar_url: string;
  };
  reactions?: {
    reaction_type: string;
    user_id: string;
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

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
          reactions:post_reactions(
            reaction_type,
            user_id
          ),
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
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to react to posts",
        variant: "destructive"
      });
      return;
    }

    try {
      // First, check if a reaction already exists
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      // Get post details to check if it's the user's own post
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (existingReaction) {
        // If reaction exists and it's the same type, delete it
        if (existingReaction.reaction_type === type) {
          const { error } = await supabase
            .from('post_reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (error) throw error;
        } else {
          // If reaction exists but different type, update it
          const { error } = await supabase
            .from('post_reactions')
            .update({ reaction_type: type })
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (error) throw error;

          // If it's the user's own post, create a notification
          if (post && post.user_id === user.id) {
            const { error: notifError } = await supabase
              .from('notifications')
              .insert({
                user_id: user.id,
                title: "Réaction à votre publication",
                message: type === 'like' ? "Vous avez aimé votre propre publication" : "Vous avez réagi à votre propre publication"
              });

            if (notifError) {
              console.error('Error creating notification:', notifError);
            }
          }
        }
      } else {
        // If no reaction exists, insert new one
        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: type
          });

        if (error) throw error;

        // If it's the user's own post, create a notification
        if (post && post.user_id === user.id) {
          const { error: notifError } = await supabase
            .from('notifications')
            .insert({
              user_id: user.id,
              title: "Réaction à votre publication",
              message: type === 'like' ? "Vous avez aimé votre propre publication" : "Vous avez réagi à votre propre publication"
            });

          if (notifError) {
            console.error('Error creating notification:', notifError);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!user) return;

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
      setPostToDelete(null);
    }
  };

  const handleHide = async (postId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to hide posts",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('hidden_posts')
      .insert({
        post_id: postId,
        user_id: user.id
      });

    if (error) {
      console.error('Hide post error:', error);
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

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="space-y-4">
      {posts?.map((post) => {
        const likes = post.reactions?.filter(r => r.reaction_type === 'like').length || 0;
        const dislikes = post.reactions?.filter(r => r.reaction_type === 'dislike').length || 0;
        const userReaction = post.reactions?.find(r => r.user_id === user?.id)?.reaction_type;
        const isExpanded = expandedComments.includes(post.id);

        return (
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{format(new Date(post.created_at), "d MMMM 'à' HH:mm", { locale: fr })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {post.privacy_level === "public" ? (
                      <>
                        <Globe className="h-3 w-3" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        <span>Connexions</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {post.user_id === user?.id ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPostToDelete(post.id)}
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
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {post.images.map((image, index) => (
                  <div key={index} className="relative">
                    {image.toLowerCase().endsWith('.pdf') ? (
                      <a 
                        href={image} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-4 bg-muted rounded hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center justify-center">
                          <span className="text-sm">Voir le PDF</span>
                        </div>
                      </a>
                    ) : (
                      <img
                        src={image}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-48 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-4 items-center">
              <Button
                variant={userReaction === 'like' ? 'default' : 'ghost'}
                size="sm"
                className="flex gap-2"
                onClick={() => handleReaction(post.id, 'like')}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{likes}</span>
              </Button>
              <Button
                variant={userReaction === 'dislike' ? 'default' : 'ghost'}
                size="sm"
                className="flex gap-2"
                onClick={() => handleReaction(post.id, 'dislike')}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{dislikes}</span>
              </Button>
              <Button
                variant={isExpanded ? 'default' : 'ghost'}
                size="sm"
                className="flex gap-2"
                onClick={() => toggleComments(post.id)}
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments?.length || 0}</span>
              </Button>
            </div>

            {isExpanded && post.comments && post.comments.length > 0 && (
              <div className="mt-4 space-y-3 pl-4 border-l-2 border-muted">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="text-sm">
                    <div className="font-medium">{comment.profiles.full_name}</div>
                    <div className="text-muted-foreground text-xs">
                      {format(new Date(comment.created_at), "d MMMM 'à' HH:mm", { locale: fr })}
                    </div>
                    <div className="mt-1">{comment.content}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}

      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette publication ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. La publication sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => postToDelete && handleDelete(postToDelete)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
