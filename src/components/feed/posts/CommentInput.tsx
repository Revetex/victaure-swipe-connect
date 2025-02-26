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
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      setIsSubmitting(true);
      const {
        error
      } = await supabase.from('post_comments').insert({
        content: content.trim(),
        post_id: postId,
        user_id: currentUserId
      });
      if (error) throw error;
      setContent("");
      onCommentAdded();
      if (postAuthorId !== currentUserId) {
        await supabase.from('notifications').insert({
          user_id: postAuthorId,
          title: 'Nouveau commentaire',
          message: `${userEmail} a commenté votre publication`
        });
      }
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été ajouté avec succès."
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du commentaire.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg space-y-2 py-0 px-0">
      <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Ajouter un commentaire..." className="resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white/90 placeholder:text-white/40" rows={1} />
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" size="sm" disabled={!content.trim() || isSubmitting} className="bg-white/10 hover:bg-white/20 text-white">
          {isSubmitting ? "Envoi..." : "Commenter"}
        </Button>
      </div>
    </form>;
}