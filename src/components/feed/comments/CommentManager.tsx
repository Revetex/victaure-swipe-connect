
import { useState } from "react";
import { Comment } from "@/types/posts";
import { PostComments } from "../../PostComments";
import { CommentInput } from "../../CommentInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CommentManagerProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  comments: Comment[];
  onCommentAdded?: () => void;
}

export function CommentManager({
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  comments,
  onCommentAdded
}: CommentManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDeleteComment = async (commentId: string) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        throw error;
      }

      // Optimistically update the UI by removing the comment
      onCommentAdded?.();

      toast({
        title: "Commentaire supprimé",
        description: "Le commentaire a été supprimé avec succès.",
      });
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du commentaire.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PostComments
        comments={comments}
        currentUserId={currentUserId}
        onDeleteComment={handleDeleteComment}
      />
      {currentUserId && userEmail && (
        <CommentInput
          postId={postId}
          postAuthorId={postAuthorId}
          currentUserId={currentUserId}
          userEmail={userEmail}
          onCommentAdded={onCommentAdded!}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}
    </div>
  );
}
