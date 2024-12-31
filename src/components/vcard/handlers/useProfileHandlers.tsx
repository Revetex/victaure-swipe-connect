import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "@/utils/profileActions";
import type { UserProfile } from "@/types/profile";

export function useProfileHandlers() {
  const { toast } = useToast();

  const handleSave = async (tempProfile: UserProfile | null, setProfile: (profile: UserProfile) => void, setIsEditing: (isEditing: boolean) => void) => {
    if (!tempProfile) return;

    try {
      await updateProfile(tempProfile);
      setProfile(tempProfile);
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
      });
    }
  };

  const handleApplyChanges = async (tempProfile: UserProfile | null, setProfile: (profile: UserProfile) => void, setIsEditing: (isEditing: boolean) => void) => {
    if (!tempProfile) return;
    
    try {
      await updateProfile(tempProfile);
      setProfile(tempProfile);
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Changements appliqués avec succès",
      });
    } catch (error) {
      console.error('Error applying changes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'appliquer les changements",
      });
    }
  };

  return {
    handleSave,
    handleApplyChanges,
  };
}