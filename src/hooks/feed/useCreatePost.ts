
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { PostAttachment, PostPrivacyLevel } from '@/components/feed/posts/types';

export function useCreatePost() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);
  const [privacyLevel, setPrivacyLevel] = useState<PostPrivacyLevel>('public');

  const addAttachment = (file: File) => {
    const preview = URL.createObjectURL(file);
    
    setAttachments(prev => [
      ...prev,
      { file, preview }
    ]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].preview);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const resetForm = () => {
    setContent('');
    setAttachments([]);
    setPrivacyLevel('public');
  };

  const uploadImages = async (): Promise<string[]> => {
    if (!attachments.length) return [];
    
    const uploadPromises = attachments.map(async (attachment) => {
      const fileName = `${user?.id}/${Date.now()}-${attachment.file.name}`;
      
      const { data, error } = await supabase.storage
        .from('posts')
        .upload(fileName, attachment.file);
      
      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }
      
      const { data: urlData } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    });
    
    return Promise.all(uploadPromises);
  };

  const createPost = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté pour publier');
      return false;
    }
    
    if (!content.trim() && !attachments.length) {
      toast.error('Votre publication ne peut pas être vide');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Upload images if any
      const imageUrls = await uploadImages();
      
      // Create post
      const { error } = await supabase.from('posts').insert({
        content: content.trim(),
        user_id: user.id,
        images: imageUrls.length ? imageUrls : null,
        privacy_level: privacyLevel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        searchable_content: content.trim()
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Publication créée avec succès');
      resetForm();
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erreur lors de la création de la publication');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    content,
    setContent,
    isLoading,
    attachments,
    privacyLevel,
    setPrivacyLevel,
    addAttachment,
    removeAttachment,
    createPost
  };
}
