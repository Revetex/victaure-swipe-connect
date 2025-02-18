import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Trash2, UserCircle2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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

  const validateImage = (file: File) => {
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
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-2 ring-primary/20 shadow-lg">
            {!imageError && profile.avatar_url ? (
              <AvatarImage 
                src={profile.avatar_url} 
                alt={profile.full_name || ''}
                className="object-contain w-full h-full"
                onError={handleImageError}
              />
            ) : (
              <AvatarFallback className="bg-primary/10">
                <UserCircle2 className="h-12 w-12 text-primary/60" />
              </AvatarFallback>
            )}
          </Avatar>
          {profile.avatar_url && !isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Maximize2 className="h-6 w-6 text-white" />
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        {isEditing && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <label 
              className="flex items-center justify-center w-10 h-10 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
              htmlFor="avatar-upload"
            >
              <Upload className="h-5 w-5 text-white/90" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={isLoading}
              />
            </label>
            {profile.avatar_url && (
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/40 transition-all duration-200"
                onClick={handleDeleteAvatar}
                disabled={isLoading}
              >
                <Trash2 className="h-5 w-5 text-white/90" />
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-3xl w-full p-0">
          <div className="relative w-full h-full max-h-[80vh] overflow-hidden">
            <img
              src={profile.avatar_url || ''}
              alt={profile.full_name || ''}
              className="w-full h-full object-contain"
              onClick={() => setShowFullscreen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
