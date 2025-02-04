import { Card } from "@/components/ui/card";
import { EyeOff, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";
import { PostComments } from "./PostComments";
import { CommentInput } from "./CommentInput";

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
    user_id: string;
    profiles: {
      full_name: string;
      avatar_url: string;
    };
  }[];
}

export function PostList() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

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
            user_id,
            profiles(
              id,
              full_name,
              avatar_url
            )
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
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingReaction) {
        if (existingReaction.reaction_type === type) {
          await supabase
            .from('post_reactions')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('post_reactions')
            .update({ reaction_type: type })
            .eq('post_id', postId)
            .eq('user_id', user.id);
        }
      } else {
        await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: type
          });
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

  const addComment = async (postId: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive"
      });
      return;
    }

    const comment = newComments[postId];
    if (!comment?.trim()) {
      toast({
        title: "Erreur",
        description: "Le commentaire ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: comment.trim()
        });

      if (error) throw error;

      setNewComments(prev => ({
        ...prev,
        [postId]: ''
      }));

      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast({
        title: "Succès",
        description: "Commentaire ajouté"
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive"
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast({
        title: "Succès",
        description: "Commentaire supprimé"
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le commentaire",
        variant: "destructive"
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
        const commentCount = post.comments?.length || 0;

        return (
          <Card key={post.id} className="p-4">
            <PostHeader
              profile={post.profiles}
              created_at={post.created_at}
              privacy_level={post.privacy_level}
            />
            
            <div className="flex gap-2 absolute right-4 top-4">
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

            <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

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

            <PostActions
              likes={likes}
              dislikes={dislikes}
              commentCount={commentCount}
              userReaction={userReaction}
              isExpanded={isExpanded}
              onLike={() => handleReaction(post.id, 'like')}
              onDislike={() => handleReaction(post.id, 'dislike')}
              onToggleComments={() => toggleComments(post.id)}
            />

            {isExpanded && post.comments && (
              <PostComments
                comments={post.comments}
                currentUserId={user?.id}
                onDeleteComment={deleteComment}
              />
            )}

            <CommentInput
              value={newComments[post.id] || ''}
              onChange={(value) => setNewComments(prev => ({
                ...prev,
                [post.id]: value
              }))}
              onSubmit={() => addComment(post.id)}
            />
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