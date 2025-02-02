import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [newPost, setNewPost] = useState("");
  const { profile } = useProfile();

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const { error } = await supabase
        .from("posts")
        .insert([
          {
            content: newPost,
            user_id: profile?.id
          }
        ]);

      if (error) throw error;

      setNewPost("");
      onPostCreated();
      toast.success("Publication créée avec succès");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création de la publication");
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Partagez quelque chose..."
          className="min-h-[100px]"
        />
        <div className="flex justify-between items-center">
          <Button variant="outline" size="icon">
            <Image className="h-4 w-4" />
          </Button>
          <Button onClick={handleCreatePost}>
            <Send className="h-4 w-4 mr-2" />
            Publier
          </Button>
        </div>
      </div>
    </Card>
  );
}