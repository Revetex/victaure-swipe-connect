
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

export function VCardAvatar({ profile, isEditing, setProfile, setIsAvatarDeleted }: VCardAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const validateImage = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format non supporté. Utilisez JPG, PNG ou WEBP");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return false;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 200 || img.height < 200) {
          toast.error("L'image doit faire au moins 200x200 pixels");
          resolve(false);
        }
        if (img.width > 2000 || img.height > 2000) {
          toast.error("L'image est trop grande (max 2000x2000 pixels)");
          resolve(false);
        }
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        toast.error("Impossible de charger l'image");
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
      if (!isValid) return;

      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('vcards')
            .remove([oldFileName]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vcards')
        .getPublicUrl(filePath);

      setProfile({ ...profile, avatar_url: publicUrl });
      setIsAvatarDeleted(false);
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Impossible de mettre à jour la photo de profil");
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
          await supabase.storage
            .from('vcards')
            .remove([fileName]);
        }
        setProfile({ ...profile, avatar_url: null });
        setIsAvatarDeleted(true);
        toast.success("Photo de profil supprimée");
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error("Impossible de supprimer la photo de profil");
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
        <div className={cn(
          "relative cursor-pointer",
          isLoading && "opacity-50"
        )}
          onClick={() => profile.avatar_url && setShowFullscreen(true)}
        >
          <AvatarImage
            url={profile.avatar_url}
            fullName={profile.full_name}
            onError={handleImageError}
            hasError={imageError}
            isLoading={isLoading}
          />
          <AvatarOverlay showOverlay={!!profile.avatar_url && !isEditing} />
          <AvatarLoader isLoading={isLoading} />
        </div>

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
