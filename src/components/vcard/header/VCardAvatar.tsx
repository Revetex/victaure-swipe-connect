
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { AvatarImage } from "./avatar/AvatarImage";
import { AvatarControls } from "./avatar/AvatarControls";
import { AvatarOverlay } from "./avatar/AvatarOverlay";
import { AvatarLoader } from "./avatar/AvatarLoader";
import { FullscreenAvatar } from "./avatar/FullscreenAvatar";

interface VCardAvatarProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  setIsAvatarDeleted: (deleted: boolean) => void;
}

export function VCardAvatar({
  profile,
  isEditing,
  setProfile,
  setIsAvatarDeleted
}: VCardAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const validateImage = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format non supporté. Utilisez JPG, PNG ou WebP", {
        id: "avatar-format-error"
      });
      return false;
    }
    return new Promise(resolve => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        toast.error("Impossible de charger l'image", {
          id: "avatar-load-error"
        });
        resolve(false);
      };
    });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setImageError(false);
      const isValid = await validateImage(file);
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      // Si une ancienne image existe, la supprimer d'abord
      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('vcards').remove([oldFileName]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(fileName);

      const updatedProfile = {
        ...profile,
        avatar_url: publicUrl
      };
      setProfile(updatedProfile);
      setIsAvatarDeleted(false);
      
      toast.success("Photo de profil mise à jour", {
        id: "avatar-update-success"
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Impossible de mettre à jour la photo de profil", {
        id: "avatar-update-error"
      });
      setImageError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setIsLoading(true);
      if (profile.avatar_url) {
        const fileName = profile.avatar_url.split('/').pop();
        if (fileName) {
          const { error } = await supabase.storage
            .from('vcards')
            .remove([fileName]);
          if (error) throw error;
        }

        const updatedProfile = {
          ...profile,
          avatar_url: null
        };
        setProfile(updatedProfile);
        setIsAvatarDeleted(true);
        
        toast.success("Photo de profil supprimée", {
          id: "avatar-delete-success"
        });
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error("Impossible de supprimer la photo de profil", {
        id: "avatar-delete-error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div className="relative group shrink-0">
        <AvatarImage
          url={profile.avatar_url}
          fullName={profile.full_name}
          onError={handleImageError}
          hasError={imageError}
          isLoading={isLoading}
          onClick={() => profile.avatar_url && setShowFullscreen(true)}
        />
        
        <AvatarLoader isLoading={isLoading} />
        
        <AvatarOverlay showOverlay={!isLoading && !imageError && !!profile.avatar_url} />

        {isEditing && !isLoading && (
          <AvatarControls 
            hasAvatar={!!profile.avatar_url} 
            isLoading={isLoading}
            onUpload={handleAvatarUpload}
            onDelete={handleDeleteAvatar}
          />
        )}
      </div>

      <FullscreenAvatar 
        isOpen={showFullscreen}
        onOpenChange={setShowFullscreen}
        imageUrl={profile.avatar_url}
        fullName={profile.full_name}
      />
    </>
  );
}
