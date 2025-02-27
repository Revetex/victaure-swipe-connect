
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile } from '@/types/profile';

export function useProfileUpdate() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastSaveStatus, setLastSaveStatus] = useState<'success' | 'error' | null>(null);
  const [lastSaveError, setLastSaveError] = useState<string | null>(null);

  const updateProfile = async (profile: UserProfile) => {
    setIsUpdating(true);
    setLastSaveStatus(null);
    setLastSaveError(null);

    try {
      // Création d'un objet de mise à jour sans les champs problématiques
      const updateData = {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        phone: profile.phone,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        skills: profile.skills,
        // Convertir online_status en boolean s'il est une string
        online_status: typeof profile.online_status === 'string' 
          ? profile.online_status === 'true'
          : !!profile.online_status,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) throw error;

      setLastSaveStatus('success');
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées avec succès.",
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setLastSaveStatus('error');
      setLastSaveError(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
      });
      
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    isUpdating,
    lastSaveStatus,
    lastSaveError
  };
}
