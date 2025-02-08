
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
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

export const CommentInput = ({ 
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  onCommentAdded,
  isSubmitting,
  setIsSubmitting 
}: CommentInputProps) => {
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content: content.trim()
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
            message: `${userEmail} a commenté votre publication`,
            type: 'comment'
          });
      }

      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été ajouté avec succès.",
      });
    } catch (error: any) {
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
    <div className="flex gap-2 mt-4">
      <Input
        placeholder="Ajouter un commentaire..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        disabled={isSubmitting}
      />
      <Button
        size="icon"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
