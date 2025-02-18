
import { UserProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { AvatarImage } from "./AvatarImage";
import { AvatarControls } from "./AvatarControls";
import { AvatarOverlay } from "./AvatarOverlay";
import { AvatarLoader } from "./AvatarLoader";
import { FullscreenAvatar } from "./FullscreenAvatar";

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

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // Calcul des dimensions optimales
        let width = img.width;
        let height = img.height;
        const maxSize = 1200;

        if (width > height && width > maxSize) {
          height = Math.round(height * (maxSize / width));
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round(width * (maxSize / height));
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Échec de la compression"));
              return;
            }
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => reject(new Error("Erreur de chargement de l'image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setImageError(false);

      // Compression de l'image si nécessaire
      const processedFile = await compressImage(file);

      if (profile.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('vcards')
            .remove([oldFileName]);
        }
      }

      const fileExt = 'jpg'; // On force le format JPG après compression
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vcards')
        .upload(filePath, processedFile);

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
      if (event.target) event.target.value = '';
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

  return (
    <>
      <div className="relative group shrink-0">
        <div 
          className={cn(
            "relative cursor-pointer",
            isLoading && "opacity-50"
          )}
          onClick={() => profile.avatar_url && setShowFullscreen(true)}
        >
          <AvatarImage
            url={profile.avatar_url}
            fullName={profile.full_name}
            onError={() => setImageError(true)}
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
