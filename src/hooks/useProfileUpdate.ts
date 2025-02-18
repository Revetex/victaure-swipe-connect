
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/profile';
import { toast } from 'sonner';
import { validateFile, compressImage } from '@/utils/fileUtils';

export function useProfileUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (profile: UserProfile) => {
    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          last_save_status: 'success',
          last_save_error: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      
      // Mettre à jour le statut d'erreur dans la base de données
      await supabase
        .from('profiles')
        .update({
          last_save_status: 'error',
          last_save_error: error.message
        })
        .eq('id', profile.id);

      toast.error(error.message || "Erreur lors de la mise à jour du profil");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
    try {
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Compression de l'image si nécessaire
      const processedFile = await compressImage(file);

      const fileName = `${userId}-${Date.now()}.jpg`;
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, processedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast.error(error.message || "Erreur lors du téléchargement de l'image");
      throw error;
    }
  };

  return {
    isUpdating,
    updateProfile,
    uploadProfileImage
  };
}
