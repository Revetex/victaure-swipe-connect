
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreatePostForm } from "./create/CreatePostForm";
import type { PostAttachment, CreatePostProps, PostPrivacyLevel } from "./types";

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState<PostPrivacyLevel>("public");
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newAttachments: PostAttachment[] = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].preview);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const handleCreatePost = async (content: string, privacyLevel: PostPrivacyLevel) => {
    if (!user) {
      toast.error("Vous devez être connecté pour publier un message");
      return;
    }

    if (!content.trim() && attachments.length === 0) {
      toast.error("Votre publication ne peut pas être vide");
      return;
    }

    setIsLoading(true);

    try {
      // Process image uploads if there are any
      const imageUrls = [];
      
      for (const attachment of attachments) {
        const fileName = `${user.id}/${Date.now()}-${attachment.file.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from("post-images")
          .upload(fileName, attachment.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Create the post with images if applicable
      const { error } = await supabase.from("posts").insert({
        content,
        user_id: user.id,
        privacy_level: privacyLevel,
        images: imageUrls.length > 0 ? imageUrls : undefined
      });

      if (error) throw error;

      toast.success("Votre publication a été créée avec succès!");
      setAttachments([]);
      setNewPost("");
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Une erreur est survenue lors de la création de votre publication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreatePostForm
      newPost={newPost}
      onPostChange={(value) => setNewPost(value)}
      privacy={privacy}
      onPrivacyChange={(value) => setPrivacy(value)}
      attachments={attachments}
      setAttachments={setAttachments}
      isLoading={isLoading}
      onSubmit={handleCreatePost}
      onCreatePost={() => {}}
      onClose={() => {}}
      onFileChange={handleFileChange}
      onRemoveFile={handleRemoveFile}
    />
  );
}
