
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { PostAttachment, PostPrivacyLevel } from "@/components/feed/posts/types";

export function useCreatePost(onPostCreated: () => void) {
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacyLevel>("public");
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { profile } = useProfile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newAttachments = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].preview);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handleCreatePost = async () => {
    if (!profile) {
      toast.error("Vous devez être connecté pour publier");
      return;
    }

    if (!newPost.trim() && attachments.length === 0) {
      toast.error("Veuillez ajouter du contenu ou une image");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedFiles: string[] = [];

      for (const { file } of attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post_attachments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post_attachments')
          .getPublicUrl(fileName);

        uploadedFiles.push(publicUrl);
      }

      const { error } = await supabase
        .from("posts")
        .insert([{
          content: newPost,
          user_id: profile.id,
          privacy_level: privacy,
          images: uploadedFiles
        }]);

      if (error) throw error;

      setNewPost("");
      setAttachments([]);
      onPostCreated();
      toast.success("Publication créée avec succès");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création de la publication");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    newPost,
    setNewPost,
    privacy,
    setPrivacy,
    attachments,
    isUploading,
    handleFileChange,
    removeFile,
    handleCreatePost
  };
}
