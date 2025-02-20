
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [newPost, setNewPost] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { profile } = useProfile();

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast.error("Veuillez ajouter du contenu");
      return;
    }

    try {
      setIsUploading(true);

      const { error } = await supabase
        .from("posts")
        .insert([
          {
            content: newPost,
            user_id: profile?.id,
          }
        ]);

      if (error) throw error;

      setNewPost("");
      onPostCreated();
      toast.success("Publication créée avec succès");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création de la publication");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="shadow-lg border-primary/10 p-4">
      <Textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Partagez quelque chose..."
        className="min-h-[100px] resize-none focus:ring-primary/20"
      />
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleCreatePost} 
          disabled={isUploading || !newPost.trim()}
          size="sm"
          className="h-9 px-4 transition-all"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Publier
        </Button>
      </div>
    </Card>
  );
}
