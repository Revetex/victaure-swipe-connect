
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CommentInputProps {
  postId: string;
  postAuthorId: string;
  currentUserId: string;
  userEmail: string;
  onCommentAdded: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export function CommentInput({
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  onCommentAdded,
  isSubmitting,
  setIsSubmitting
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('post_comments')
        .insert({
          content: content.trim(),
          post_id: postId,
          user_id: currentUserId
        });

      if (error) throw error;

      setContent("");
      onCommentAdded();

      // Create notification for post author if it's not their own comment
      if (postAuthorId !== currentUserId) {
        await supabase
          .from('notifications')
          .insert({
            user_id: postAuthorId,
            title: 'Nouveau commentaire',
            message: `${userEmail} a commenté votre publication`
          });
      }

      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été ajouté avec succès.",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du commentaire.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ajouter un commentaire..."
        className="resize-none mobile-friendly-input"
      />
      <Button 
        type="submit" 
        disabled={!content.trim() || isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Envoi..." : "Commenter"}
      </Button>
    </form>
  );
}
