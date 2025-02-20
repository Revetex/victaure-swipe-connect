
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier");
        return;
      }

      const { error } = await supabase.from('posts').insert({
        content: content.trim(),
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Publication créée avec succès");
      setContent("");
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Quoi de neuf ?"
          className="w-full resize-none"
          rows={3}
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!content.trim() || isSubmitting}
          >
            Publier
          </Button>
        </div>
      </form>
    </div>
  );
}
