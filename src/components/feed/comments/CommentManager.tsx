
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostComments } from "../PostComments";
import { CommentInput } from "../CommentInput";
import { Comment } from "@/types/posts";

interface CommentManagerProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  comments?: Comment[];
  onCommentAdded: () => void;
}

export const CommentManager = ({
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  comments,
  onCommentAdded
}: CommentManagerProps) => {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");

  const createNotification = async (userId: string, title: string, message: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const addComment = async () => {
    if (!currentUserId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive"
      });
      return;
    }

    if (!newComment?.trim()) {
      toast({
        title: "Erreur",
        description: "Le commentaire ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error: commentError } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content: newComment.trim()
        });

      if (commentError) throw commentError;

      // Create notification for post author
      if (postAuthorId !== currentUserId) {
        await createNotification(
          postAuthorId,
          'Nouveau commentaire',
          `${userEmail} a commenté votre publication: "${newComment.substring(0, 50)}${newComment.length > 50 ? '...' : ''}"`,
        );

        // Get author's push token
        const { data: authorProfile } = await supabase
          .from('profiles')
          .select('push_token, push_notifications_enabled')
          .eq('id', postAuthorId)
          .single();

        // Send push notification if enabled
        if (authorProfile?.push_notifications_enabled && authorProfile?.push_token) {
          try {
            const subscription = JSON.parse(authorProfile.push_token);
            await fetch('/api/push-notification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                subscription,
                title: 'Nouveau commentaire',
                message: `${userEmail} a commenté votre publication`
              })
            });
          } catch (error) {
            console.error('Error sending push notification:', error);
          }
        }
      }

      setNewComment("");
      onCommentAdded();
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
        .eq('id', commentId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      // Notify post author about deleted comment
      if (postAuthorId !== currentUserId) {
        await createNotification(
          postAuthorId,
          'Commentaire supprimé',
          `Un commentaire a été supprimé de votre publication`
        );
      }

      onCommentAdded();
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

  return (
    <div className="space-y-4">
      {comments && (
        <PostComments
          comments={comments}
          currentUserId={currentUserId}
          onDeleteComment={deleteComment}
        />
      )}
      <CommentInput
        value={newComment}
        onChange={setNewComment}
        onSubmit={addComment}
      />
    </div>
  );
};
